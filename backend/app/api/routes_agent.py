from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.agents.qwen_agent import OpenRouterAgent, AgentDecision

router = APIRouter(prefix="/api/agent", tags=["agent"])
agent = OpenRouterAgent()

from fastapi import Request

@router.post("/analyze", response_model=AgentDecision)
async def analyze_opportunity(request: Request):
    try:
        from app.services.communication_service import communication_service
        context = await request.json()
        decision = await agent.analyze_and_decide(context)
        
        # If a phone number is provided in context, dispatch real SMS
        phone = context.get("customer", {}).get("phone") or context.get("phone")
        if phone and decision.recommended_action in ["PAYMENT_LINK", "REMINDER"]:
            import asyncio
            # Fire and forget SMS dispatch
            asyncio.create_task(communication_service.dispatch_intervention(
                strategy=decision.recommended_action, 
                phone=phone
            ))
            
        return decision
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel

class SimulateRequest(BaseModel):
    revenueRisk: float
    cases: int
    avgTransaction: float

@router.post("/simulate")
async def simulate_recovery(request: SimulateRequest):
    # In a real scenario, this would query historical data to calculate actual rates.
    # For the demo, we simulate the performance difference based on inputs.
    rule_based_recovery_rate = 0.25
    ai_recovery_rate = 0.64  # Give AI a slight boost to show dynamic calculation
    
    rule_recovered = request.revenueRisk * rule_based_recovery_rate
    ai_recovered = request.revenueRisk * ai_recovery_rate
    
    return {
        "ruleBased": {
            "recovered": rule_recovered,
            "net": rule_recovered - (request.cases * 15),
            "cost": request.cases * 15,
            "rate": rule_based_recovery_rate * 100,
        },
        "ai": {
            "recovered": ai_recovered,
            "net": ai_recovered - (request.cases * 5),
            "cost": request.cases * 5,
            "rate": ai_recovery_rate * 100,
        }
    }
