import pytest
from app.agents.qwen_agent import QwenAgent, AgentDecision
from app.models.domain import StrategyType

@pytest.mark.asyncio
async def test_qwen_agent_fallback():
    # Since we don't want to actually call Ollama in unit tests by default, 
    # we can test the fallback mechanism
    agent = QwenAgent(base_url="http://invalid-url-for-test:11434")
    context = {
        "case_id": "TEST_123",
        "amount": 5000,
        "event_type": "CHECKOUT_ABANDONMENT"
    }
    decision = await agent.analyze_and_decide(context)
    
    # Should use fallback decision
    assert isinstance(decision, AgentDecision)
    assert decision.case_id == "TEST_123"
    assert decision.root_cause == "SYSTEM_FALLBACK"
    assert decision.recommended_strategy == StrategyType.PAYMENT_LINK.value
    assert decision.expected_recovery == 5000.0
    assert decision.requires_human_review is True

@pytest.mark.asyncio
async def test_qwen_agent_fallback_payment_failure():
    agent = QwenAgent(base_url="http://invalid-url-for-test:11434")
    context = {
        "case_id": "TEST_456",
        "amount": 1000,
        "event_type": "PAYMENT_FAILURE"
    }
    decision = await agent.analyze_and_decide(context)
    
    assert decision.recommended_strategy == StrategyType.SMART_RETRY.value
