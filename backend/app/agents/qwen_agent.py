import httpx
import json
from typing import Dict, Any, Optional
from pydantic import BaseModel
from app.models.domain import StrategyType
from app.core.config import settings

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

class OpenRouterAgent:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.model = settings.OPENROUTER_MODEL
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        
    async def analyze_and_decide(self, context: Dict[str, Any]) -> AgentDecision:
        prompt = self._build_prompt(context)
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are RecoverAI, an autonomous revenue recovery agent. Return ONLY valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "response_format": { "type": "json_object" }
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "RecoverAI",
            "Content-Type": "application/json"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(self.base_url, headers=headers, json=payload, timeout=30.0)
                response.raise_for_status()
                data = response.json()
                
                try:
                    content = data["choices"][0]["message"]["content"]
                    result_json = json.loads(content)
                    return AgentDecision(**result_json)
                except Exception as parse_err:
                    return self._fallback_decision(context, f"JSON parse error: {str(parse_err)}\nContent: {content}")
                    
        except Exception as e:
            return self._fallback_decision(context, f"LLM connection error: {str(e)}")

    def analyze_and_decide_sync(self, context: Dict[str, Any]) -> AgentDecision:
        prompt = self._build_prompt(context)
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are RecoverAI, an autonomous revenue recovery agent. Return ONLY valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "response_format": { "type": "json_object" }
        }
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "RecoverAI",
            "Content-Type": "application/json"
        }
        
        try:
            with httpx.Client() as client:
                response = client.post(self.base_url, headers=headers, json=payload, timeout=30.0)
                response.raise_for_status()
                data = response.json()
                
                try:
                    content = data["choices"][0]["message"]["content"]
                    result_json = json.loads(content)
                    return AgentDecision(**result_json)
                except Exception as parse_err:
                    return self._fallback_decision(context, f"JSON parse error: {str(parse_err)}\nContent: {content}")
                    
        except Exception as e:
            return self._fallback_decision(context, f"LLM connection error: {str(e)}")

            
    def _build_prompt(self, context: Dict[str, Any]) -> str:
        return f"""
        Analyze the following context and decide the best recovery strategy.
        Return ONLY valid JSON matching exactly this schema:
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
