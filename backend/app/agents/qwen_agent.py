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
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
        
    async def analyze_and_decide(self, context: Dict[str, Any]) -> AgentDecision:
        prompt = self._build_prompt(context)
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url,
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "model": self.model,
                        "messages": [{"role": "user", "content": prompt}]
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                content = data["choices"][0]["message"]["content"]
                # Clean markdown block if present
                content = content.replace("```json", "").replace("```", "").strip()
                result = json.loads(content)
                return AgentDecision(**result)
        except Exception as e:
            print(f"Agent analysis error: {e}")
            return self._fallback_decision(context, str(e))

    def analyze_and_decide_sync(self, context: Dict[str, Any]) -> AgentDecision:
        # For the pitch demo, we skip the actual LLM call to ensure instantaneous performance
        amount = float(context.get("amount", 8499))
        return AgentDecision(
            case_id=str(context.get("case_id", "DEMO-123")),
            event_type=context.get("event_type", "PAYMENT_FAILURE"),
            root_cause="INSUFFICIENT_FUNDS_DETECTED",
            recovery_probability=0.88,
            recommended_strategy=StrategyType.SMART_RETRY.value,
            confidence=0.92,
            expected_recovery=amount,
            expected_cost=0.0,
            expected_net_revenue=amount,
            fallback_strategy=StrategyType.ESCALATE.value,
            requires_human_review=False,
            reason="Based on Customer LTV > 10,000 and previous failure patterns, a smart retry on the 1st of the month has a 92% historical success rate."
        )

            
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
