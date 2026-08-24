import asyncio
import os
import sys

# Add backend dir to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.agents.qwen_agent import QwenAgent
from app.policies.policy_engine import PolicyEngine, PolicyDecision
from app.models.domain import StrategyType, Policy

async def test_qwen_agent():
    print("--- Testing Phase 6: Qwen Agent ---")
    agent = QwenAgent()
    context = {
        "case_id": "CASE_123",
        "event_type": "PAYMENT_FAILURE",
        "amount": 5000.0,
        "customer_history": "Good",
        "root_cause_prediction": "Insufficient Funds"
    }
    
    print(f"Context: {context}")
    print("Calling Agent (this will use fallback if Ollama is not running)...")
    decision = await agent.analyze_and_decide(context)
    
    print("\nDecision received:")
    print(decision.model_dump_json(indent=2))
    print("Phase 6 Test Complete.\n")

def test_policy_engine():
    print("--- Testing Phase 7: Policy Engine ---")
    engine = PolicyEngine()
    policy = Policy(
        max_payment_retries=2,
        max_customer_messages=3,
        max_recovery_window_hours=48,
        min_recovery_probability=0.4
    )
    
    context = {
        "retries_count": 1,
        "messages_count": 1,
        "time_elapsed_hours": 12,
        "recovery_probability": 0.8
    }
    
    print("Test 1: Valid Action (Smart Retry)")
    decision = engine.validate_action(StrategyType.SMART_RETRY, context, policy)
    print(f"Allowed: {decision.allowed}, Reason: {decision.reason}")
    assert decision.allowed == True
    
    print("\nTest 2: Exceeding Max Retries")
    context["retries_count"] = 3
    decision = engine.validate_action(StrategyType.SMART_RETRY, context, policy)
    print(f"Allowed: {decision.allowed}, Reason: {decision.reason}")
    assert decision.allowed == False
    
    print("\nTest 3: Exceeding Recovery Window")
    context["retries_count"] = 0
    context["time_elapsed_hours"] = 50
    decision = engine.validate_action(StrategyType.PAYMENT_LINK, context, policy)
    print(f"Allowed: {decision.allowed}, Reason: {decision.reason}")
    assert decision.allowed == False
    
    print("\nTest 4: Stop Conditions")
    context["time_elapsed_hours"] = 50
    stop, reason = engine.check_stop_conditions(context, policy)
    print(f"Stop: {stop}, Reason: {reason}")
    assert stop == True
    
    print("\nPhase 7 Test Complete.")

async def main():
    await test_qwen_agent()
    test_policy_engine()

if __name__ == "__main__":
    asyncio.run(main())
