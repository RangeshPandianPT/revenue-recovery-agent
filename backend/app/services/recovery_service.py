from sqlalchemy.orm import Session
from app.models.domain import RecoveryOpportunity, RecoveryAction, Escalation, PromiseToPay, StrategyType, RecoveryStatus
from app.schemas.recovery import RecoveryActionCreate, EscalationCreate, PromiseToPayCreate
from datetime import datetime, timedelta

def execute_strategy(db: Session, opportunity_id: str, strategy: StrategyType, details: str = ""):
    # Get the opportunity
    opportunity = db.query(RecoveryOpportunity).filter(RecoveryOpportunity.id == opportunity_id).first()
    if not opportunity:
        return None

    action = RecoveryAction(
        opportunity_id=opportunity_id,
        action_type=strategy,
        status="SUCCESS",
        cost=0.0
    )

    if strategy == StrategyType.SMART_RETRY:
        # Simulate smart retry
        pass
    elif strategy == StrategyType.PAYMENT_LINK:
        # Simulate payment link sent
        pass
    elif strategy == StrategyType.REMINDER:
        # Simulate sending a reminder
        pass
    elif strategy == StrategyType.PROMISE_TO_PAY:
        # Simulate creating a promise to pay
        promise = PromiseToPay(
            customer_id=opportunity.customer_id,
            invoice_id=opportunity.invoice_id,
            amount=opportunity.amount,
            promise_date=datetime.utcnow() + timedelta(days=7),
            status="PENDING"
        )
        db.add(promise)
    elif strategy == StrategyType.INCENTIVE:
        # Simulate incentive
        action.cost = opportunity.amount * 0.05 # 5% incentive cost
    elif strategy == StrategyType.ESCALATE:
        escalation = Escalation(
            opportunity_id=opportunity_id,
            reason=details if details else "Agent requested escalation",
            priority="HIGH",
            status="OPEN"
        )
        db.add(escalation)
        opportunity.status = RecoveryStatus.ESCALATED
        action.status = "SUCCESS"

    db.add(action)
    db.commit()
    db.refresh(action)
    return action

def handle_successful_recovery(db: Session, opportunity_id: str, amount_recovered: float, cost: float = 0.0):
    opportunity = db.query(RecoveryOpportunity).filter(RecoveryOpportunity.id == opportunity_id).first()
    if opportunity:
        opportunity.status = RecoveryStatus.RECOVERED
        db.commit()
        db.refresh(opportunity)
    return opportunity
