import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.risk_engine import risk_engine
from app.services.ml_service import ml_service

def run_tests():
    print("--- Testing Phase 4: Risk Engine ---")
    
    # Test 1: Event Classification
    event = {"type": "payment.failed", "is_subscription": False}
    event_type = risk_engine.classify_event(event)
    assert event_type == "PAYMENT_FAILURE"
    print(f"Event classified correctly: {event_type}")
    
    # Test 2: Root Cause Diagnosis
    context = {"error_code": "BAD_REQUEST_ERROR", "error_description": "Insufficient balance"}
    root_cause = risk_engine.diagnose_root_cause("PAYMENT_FAILURE", context)
    assert root_cause == "INSUFFICIENT_FUNDS"
    print(f"Root cause diagnosed correctly: {root_cause}")
    
    print("\n--- Testing Phase 5: ML Engine ---")
    
    # Test 3: Recovery Probability Prediction
    features = {
        "customer_lifetime_value": 15000,
        "root_cause": "TEMPORARY_BANK_FAILURE",
        "previous_failures": 0
    }
    prob, pos, neg = ml_service.predict_recovery_probability(features)
    print(f"Probability: {prob}")
    print(f"Positive Factors: {pos}")
    print(f"Negative Factors: {neg}")
    assert prob > 0.8
    assert len(pos) == 3
    assert len(neg) == 0
    print("ML Recovery Probability Prediction OK")
    
    # Test 4: Purchase Intent Prediction
    features_checkout = {
        "time_on_checkout": 150,
        "cart_value": 6000
    }
    prob_intent, pos_intent, neg_intent = ml_service.predict_purchase_intent(features_checkout)
    print(f"Intent Probability: {prob_intent}")
    print(f"Intent Positive Factors: {pos_intent}")
    assert prob_intent > 0.6
    print("ML Purchase Intent Prediction OK")

    print("\nAll Phase 4 & 5 tests passed successfully!")

if __name__ == "__main__":
    run_tests()
