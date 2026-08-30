import random
from sqlalchemy.orm import Session
from app.models.domain import RecoveryBatch, BatchCase, RecoveryOpportunity, RecoveryStatus, StrategyType, Transaction, Policy, Customer
from app.services.recovery_service import execute_strategy, handle_successful_recovery
from app.services.risk_engine import risk_engine
from app.services.ml_service import ml_service
from app.policies.policy_engine import PolicyEngine

policy_engine = PolicyEngine()

def run_batch_simulation(db: Session, merchant_id: str, num_cases: int = 100):
    # Get unrecovered opportunities for the merchant (simulate batch cases)
    # We will just fetch a set of PENDING opportunities
    opportunities = db.query(RecoveryOpportunity).filter(
        RecoveryOpportunity.merchant_id == merchant_id,
        RecoveryOpportunity.status == RecoveryStatus.PENDING
    ).limit(num_cases).all()
    
    if not opportunities:
        return None

    # Get the merchant's policy
    policy = db.query(Policy).filter(Policy.merchant_id == merchant_id).first()
    if not policy:
        # Fallback default policy for simulation
        policy = Policy(
            merchant_id=merchant_id,
            max_payment_retries=2,
            max_customer_messages=2,
            max_recovery_window_hours=72,
            max_incentive_percent=5.0,
            min_recovery_probability=0.30,
            high_value_escalation_threshold=50000.0
        )

    # Calculate initial batch totals
    revenue_at_risk = sum([opp.amount for opp in opportunities])
    
    batch = RecoveryBatch(
        merchant_id=merchant_id,
        total_cases=len(opportunities),
        revenue_at_risk=revenue_at_risk,
        status="PROCESSING"
    )
    db.add(batch)
    db.commit()
    db.refresh(batch)

    recoverable_cases = 0
    actions_executed = 0
    successful_recoveries = 0
    gross_revenue_recovered = 0.0
    recovery_costs = 0.0

    llm_calls = 0

    for opp in opportunities:
        batch_case = BatchCase(
            batch_id=batch.id,
            opportunity_id=opp.id,
            status="PROCESSING"
        )
        db.add(batch_case)
        db.commit()

        # Step 1: Predict Recovery Probability
        transaction = db.query(Transaction).filter(Transaction.id == opp.transaction_id).first()
        transaction_amount = transaction.amount if transaction else opp.amount
        
        customer = db.query(Customer).filter(Customer.id == opp.customer_id).first()
        
        prob, _, _ = ml_service.predict_recovery_probability({
            'customer_lifetime_value': customer.lifetime_value if customer else 0,
            'root_cause': "TEMPORARY_BANK_FAILURE",
            'previous_failures': 0
        })
        
        opp.recovery_probability = prob
        
        if prob > 0.3:
            recoverable_cases += 1
            
            # Step 2: Agent Selection via Real AI
            context = {
                "case_id": opp.id,
                "amount": opp.amount,
                "event_type": "PAYMENT_FAILURE",
                "recovery_probability": prob,
            }
            try:
                if False: # Disabled for fast demo rendering: llm_calls < 3
                    from app.agents.qwen_agent import OpenRouterAgent
                    agent = OpenRouterAgent()
                    decision = agent.analyze_and_decide_sync(context)
                    llm_calls += 1
                    
                    selected_strategy = StrategyType(decision.recommended_strategy)
                    ai_reasoning = decision.reason
                    ai_confidence = decision.confidence
                    expected_net = decision.expected_net_revenue
                else:
                    strategies = [StrategyType.SMART_RETRY, StrategyType.PAYMENT_LINK, StrategyType.REMINDER]
                    selected_strategy = random.choice(strategies)
                    ai_reasoning = "Fast simulated AI decision for bulk batch processing."
                    ai_confidence = 0.85
                    expected_net = opp.amount
            except Exception as e:
                print(f"Agent failed, falling back: {e}")
                strategies = [StrategyType.SMART_RETRY, StrategyType.PAYMENT_LINK, StrategyType.REMINDER]
                selected_strategy = random.choice(strategies)
                ai_reasoning = f"Fallback due to error: {str(e)}"
                ai_confidence = 0.5
                expected_net = opp.amount
            
            # Step 3: Policy Check
            context = {
                "amount": opp.amount,
                "recovery_probability": prob,
                "retries_count": 0,
                "messages_count": 0,
                "time_elapsed_hours": 2,
                "incentive_percent": 0.0
            }
            policy_result = policy_engine.validate_action(selected_strategy, context, policy)
            
            from app.models.domain import AuditLog
            audit_log = AuditLog(
                merchant_id=merchant_id,
                opportunity_id=opp.id,
                actor="AI_AGENT",
                action="STRATEGY_SELECTION",
                reason=ai_reasoning,
                policy_decision="PASSED" if policy_result.allowed else "BLOCKED",
                outcome=selected_strategy.value,
                revenue_impact=expected_net
            )
            db.add(audit_log)
            
            if policy_result.allowed:
                # Step 4: Execute Strategy
                action = execute_strategy(db, opp.id, selected_strategy)
                if action:
                    actions_executed += 1
                    
                    # Step 5: Simulate Outcome
                    if random.random() < prob:
                        # Success
                        handle_successful_recovery(db, opp.id, opp.amount, action.cost)
                        successful_recoveries += 1
                        gross_revenue_recovered += opp.amount
                        recovery_costs += action.cost
                        batch_case.status = "SUCCESS"
                    else:
                        opp.status = RecoveryStatus.FAILED
                        batch_case.status = "FAILED"
            else:
                opp.status = RecoveryStatus.STOPPED
                batch_case.status = "BLOCKED_BY_POLICY"
        else:
            opp.status = RecoveryStatus.STOPPED
            batch_case.status = "LOW_PROBABILITY"

        db.commit()

    # Finalize batch
    batch.recoverable_cases = recoverable_cases
    batch.actions_executed = actions_executed
    batch.successful_recoveries = successful_recoveries
    batch.gross_revenue_recovered = gross_revenue_recovered
    batch.recovery_costs = recovery_costs
    batch.net_revenue_recovered = gross_revenue_recovered - recovery_costs
    batch.status = "COMPLETED"
    
    db.commit()
    db.refresh(batch)
    
    return batch
