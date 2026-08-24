import httpx
import json
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.models.domain import StrategyType

class AgentDecision(BaseModel):
    case_id: str
    event_type: str
    root_cause: str
    recovery_probability: float
    recommended_strategy: str
    confidence: float
    expected_recovery: float
    expected_cost: float
    expected_net_revenue: float
    fallback_strategy: str
    requires_human_review: bool
    reason: str

class QwenAgent:
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "qwen2.5:8b"):
        self.base_url = base_url
        self.model = model
        
    async def analyze_and_decide(self, context: Dict[str, Any]) -> AgentDecision:
        prompt = self._build_prompt(context)
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(f"{self.base_url}/api/generate", json=payload, timeout=30.0)
                response.raise_for_status()
                data = response.json()
                
                try:
                    result_json = json.loads(data.get("response", "{}"))
                    return AgentDecision(**result_json)
                except Exception as parse_err:
                    return self._fallback_decision(context, f"JSON parse error: {str(parse_err)}")
                    
        except Exception as e:
            return self._fallback_decision(context, f"LLM connection error: {str(e)}")
            
    def _build_prompt(self, context: Dict[str, Any]) -> str:
        return f"""
        You are RecoverAI, an autonomous revenue recovery agent.
        Analyze the following context and decide the best recovery strategy.
        Return ONLY valid JSON matching this schema:
        {{
            "case_id": "string",
            "event_type": "string",
            "root_cause": "string",
            "recovery_probability": float (0-1),
            "recommended_strategy": "string (SMART_RETRY, PAYMENT_LINK, REMINDER, PROMISE_TO_PAY, INCENTIVE, ESCALATE)",
            "confidence": float (0-1),
            "expected_recovery": float,
            "expected_cost": float,
            "expected_net_revenue": float,
            "fallback_strategy": "string",
            "requires_human_review": bool,
            "reason": "string"
        }}
        
        Context:
        {json.dumps(context, indent=2)}
        """

    def _fallback_decision(self, context: Dict[str, Any], error: str = "") -> AgentDecision:
        """Deterministic fallback when LLM is unavailable to ensure the system keeps working."""
        amount = float(context.get("amount", 0.0))
        event_type = context.get("event_type", "PAYMENT_FAILURE")
        
        strategy = StrategyType.SMART_RETRY.value
        if event_type in ["CHECKOUT_ABANDONMENT", "OVERDUE_RECEIVABLE"]:
            strategy = StrategyType.PAYMENT_LINK.value
            
        return AgentDecision(
            case_id=str(context.get("case_id", "UNKNOWN")),
            event_type=event_type,
            root_cause="SYSTEM_FALLBACK",
            recovery_probability=0.75,
            recommended_strategy=strategy,
            confidence=0.5,
            expected_recovery=amount,
            expected_cost=0.0,
            expected_net_revenue=amount,
            fallback_strategy=StrategyType.ESCALATE.value,
            requires_human_review=True,
            reason=f"Fallback decision used due to LLM error: {error}"
        )
