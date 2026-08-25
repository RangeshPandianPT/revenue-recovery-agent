import pytest
from app.services.ml_service import ml_service

def test_predict_recovery_probability():
    # Base case
    prob, pos, neg = ml_service.predict_recovery_probability({})
    assert prob == 0.50 # 0.50 - 0.05 (clv < 1000) + 0.05 (0 failures)
    assert len(pos) == 1
    assert len(neg) == 1
    
    # High CLV and temporary failure
    features = {
        "customer_lifetime_value": 15000,
        "root_cause": "TEMPORARY_BANK_FAILURE",
        "previous_failures": 0
    }
    prob, pos, neg = ml_service.predict_recovery_probability(features)
    assert prob == 0.90 # 0.50 + 0.15 + 0.20 + 0.05
    assert len(pos) == 3
    assert len(neg) == 0
    
    # High risk block
    features = {
        "root_cause": "HIGH_RISK_BLOCKED",
        "previous_failures": 3
    }
    prob, pos, neg = ml_service.predict_recovery_probability(features)
    assert prob == 0.01 # bounded
    assert len(neg) == 3

def test_predict_purchase_intent():
    # Low intent bounce
    features = {"time_on_checkout": 5}
    prob, pos, neg = ml_service.predict_purchase_intent(features)
    assert prob == 0.20 # 0.40 - 0.20
    assert len(neg) == 1
    
    # High intent
    features = {"time_on_checkout": 150, "cart_value": 6000}
    prob, pos, neg = ml_service.predict_purchase_intent(features)
    assert prob == 0.75 # 0.40 + 0.25 + 0.10
    assert len(pos) == 2

def test_predict_payment_probability():
    # Good payer
    features = {"days_overdue": 5, "promise_kept_rate": 0.9}
    prob, pos, neg = ml_service.predict_payment_probability(features)
    assert prob == 0.95 # 0.70 + 0.10 + 0.15
    assert len(pos) == 2
    
    # Bad payer
    features = {"days_overdue": 70, "promise_kept_rate": 0.1}
    prob, pos, neg = ml_service.predict_payment_probability(features)
    assert prob == 0.20 # 0.70 - 0.30 - 0.20
    assert len(neg) == 2
