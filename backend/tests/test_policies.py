import pytest
from app.policies.policy_engine import PolicyEngine
from app.models.domain import Policy, StrategyType

@pytest.fixture
def policy_engine():
    return PolicyEngine()

@pytest.fixture
def default_policy():
    return Policy(
        max_payment_retries=2,
        max_customer_messages=2,
        max_recovery_window_hours=72,
        max_incentive_percent=5.0,
        min_recovery_probability=0.30,
        high_value_escalation_threshold=50000.0,
    )

def test_validate_action_smart_retry(policy_engine, default_policy):
    context = {"retries_count": 1}
    decision = policy_engine.validate_action(StrategyType.SMART_RETRY, context, default_policy)
    assert decision.allowed == True
    
    context = {"retries_count": 2}
    decision = policy_engine.validate_action(StrategyType.SMART_RETRY, context, default_policy)
    assert decision.allowed == False
    assert "Max payment retries" in decision.reason

def test_validate_action_messages(policy_engine, default_policy):
    context = {"messages_count": 1}
    decision = policy_engine.validate_action(StrategyType.REMINDER, context, default_policy)
    assert decision.allowed == True
    
    context = {"messages_count": 2}
    decision = policy_engine.validate_action(StrategyType.REMINDER, context, default_policy)
    assert decision.allowed == False

def test_validate_action_incentive(policy_engine, default_policy):
    context = {"incentive_percent": 3.0}
    decision = policy_engine.validate_action(StrategyType.INCENTIVE, context, default_policy)
    assert decision.allowed == True
    
    context = {"incentive_percent": 6.0}
    decision = policy_engine.validate_action(StrategyType.INCENTIVE, context, default_policy)
    assert decision.allowed == False

def test_check_stop_conditions(policy_engine, default_policy):
    # Paid
    stop, reason = policy_engine.check_stop_conditions({"is_paid": True}, default_policy)
    assert stop == True
    
    # Opt out
    stop, reason = policy_engine.check_stop_conditions({"opt_out": True}, default_policy)
    assert stop == True
    
    # Not stopped
    stop, reason = policy_engine.check_stop_conditions({"is_paid": False}, default_policy)
    assert stop == False

def test_check_escalation(policy_engine, default_policy):
    # High value
    esc, reason = policy_engine.check_escalation({"amount": 55000.0}, default_policy)
    assert esc == True
    
    # Normal value
    esc, reason = policy_engine.check_escalation({"amount": 10000.0}, default_policy)
    assert esc == False
    
    # Dispute
    esc, reason = policy_engine.check_escalation({"customer_dispute": True}, default_policy)
    assert esc == True
