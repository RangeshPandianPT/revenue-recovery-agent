import pytest
from app.services.batch_service import run_batch_simulation
from app.models.domain import RecoveryOpportunity, RecoveryStatus, Policy

def test_run_batch_simulation(db_session):
    # Setup mock data for simulation
    # Add a merchant and an opportunity
    merchant_id = "merch_123"
    
    opp = RecoveryOpportunity(
        id="opp_1",
        merchant_id=merchant_id,
        customer_id="cust_1",
        transaction_id="txn_1",
        type="PAYMENT_FAILURE",
        amount=1000.0,
        status=RecoveryStatus.PENDING
    )
    db_session.add(opp)
    
    policy = Policy(
        merchant_id=merchant_id,
        max_payment_retries=2,
        max_customer_messages=2,
        max_recovery_window_hours=72,
        max_incentive_percent=5.0,
        min_recovery_probability=0.30,
        high_value_escalation_threshold=50000.0
    )
    db_session.add(policy)
    db_session.commit()
    
    # Run simulation
    batch = run_batch_simulation(db_session, merchant_id, num_cases=1)
    
    assert batch is not None
    assert batch.merchant_id == merchant_id
    assert batch.total_cases == 1
    assert batch.revenue_at_risk == 1000.0
    assert batch.status == "COMPLETED"
