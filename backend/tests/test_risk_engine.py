import pytest
from app.services.risk_engine import risk_engine

def test_classify_event():
    # Test PAYMENT_FAILURE
    assert risk_engine.classify_event({"type": "payment.failed"}) == "PAYMENT_FAILURE"
    assert risk_engine.classify_event({"type": "payment.failed", "is_subscription": True}) == "SUBSCRIPTION_FAILURE"
    
    # Test CHECKOUT_ABANDONMENT
    assert risk_engine.classify_event({"type": "checkout.abandoned"}) == "CHECKOUT_ABANDONMENT"
    
    # Test OVERDUE_RECEIVABLE
    assert risk_engine.classify_event({"type": "invoice.overdue"}) == "OVERDUE_RECEIVABLE"
    
    # Test UNKNOWN
    assert risk_engine.classify_event({"type": "unknown.event"}) == "UNKNOWN"

def test_diagnose_root_cause_payment():
    # INSUFFICIENT_FUNDS
    assert risk_engine.diagnose_root_cause("PAYMENT_FAILURE", {"error_description": "insufficient balance"}) == "INSUFFICIENT_FUNDS"
    assert risk_engine.diagnose_root_cause("PAYMENT_FAILURE", {"error_code": "BAD_REQUEST_ERROR"}) == "INSUFFICIENT_FUNDS"
    
    # NETWORK_TIMEOUT
    assert risk_engine.diagnose_root_cause("SUBSCRIPTION_FAILURE", {"error_description": "network timeout"}) == "NETWORK_TIMEOUT"
    
    # TEMPORARY_BANK_FAILURE
    assert risk_engine.diagnose_root_cause("PAYMENT_FAILURE", {"error_description": "issuer bank unavailable"}) == "TEMPORARY_BANK_FAILURE"
    
    # GENERIC_FAILURE
    assert risk_engine.diagnose_root_cause("PAYMENT_FAILURE", {"error_description": "unknown error"}) == "GENERIC_FAILURE"

def test_diagnose_root_cause_checkout():
    assert risk_engine.diagnose_root_cause("CHECKOUT_ABANDONMENT", {"time_on_page": 5}) == "LOW_INTENT_BOUNCE"
    assert risk_engine.diagnose_root_cause("CHECKOUT_ABANDONMENT", {"time_on_page": 20, "payment_attempts": 1}) == "PAYMENT_FRICTION"
    assert risk_engine.diagnose_root_cause("CHECKOUT_ABANDONMENT", {"time_on_page": 20, "payment_attempts": 0}) == "UNDECIDED_CUSTOMER"

def test_diagnose_root_cause_receivable():
    assert risk_engine.diagnose_root_cause("OVERDUE_RECEIVABLE", {"previous_promises": 1}) == "BROKEN_PROMISE"
    assert risk_engine.diagnose_root_cause("OVERDUE_RECEIVABLE", {"days_overdue": 45, "previous_promises": 0}) == "PROLONGED_DELINQUENCY"
    assert risk_engine.diagnose_root_cause("OVERDUE_RECEIVABLE", {"days_overdue": 10, "previous_promises": 0}) == "MISSED_DEADLINE"
