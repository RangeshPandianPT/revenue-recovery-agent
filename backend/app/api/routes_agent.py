from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.agents.qwen_agent import OpenRouterAgent, AgentDecision

router = APIRouter(prefix="/api/agent", tags=["agent"])
agent = OpenRouterAgent()

@router.post("/analyze", response_model=AgentDecision)
async def analyze_opportunity(context: Dict[str, Any]):
    try:
        decision = await agent.analyze_and_decide(context)
        return decision
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
