from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.models.domain import (
    RecoveryOpportunity, RecoveryStatus, EventType,
    RecoveryAction, Escalation, AuditLog, Customer, Transaction
)

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_at_risk = db.query(func.sum(RecoveryOpportunity.amount)).scalar() or 0
    total_cases = db.query(func.count(RecoveryOpportunity.id)).scalar() or 0

    recovered = db.query(func.sum(RecoveryOpportunity.expected_recovery)).filter(
        RecoveryOpportunity.status == RecoveryStatus.RECOVERED
    ).scalar() or 0

    recovery_rate = round((recovered / total_at_risk * 100), 2) if total_at_risk > 0 else 0

    by_type = {}
    for event_type in EventType:
        count = db.query(func.count(RecoveryOpportunity.id)).filter(
            RecoveryOpportunity.type == event_type
        ).scalar() or 0
        amount = db.query(func.sum(RecoveryOpportunity.amount)).filter(
            RecoveryOpportunity.type == event_type
        ).scalar() or 0
        by_type[event_type.value] = {"count": count, "amount": round(amount, 2)}

    escalations_open = db.query(func.count(Escalation.id)).filter(
        Escalation.status == "OPEN"
    ).scalar() or 0

    actions_executed = db.query(func.count(RecoveryAction.id)).scalar() or 0

    return {
        "total_revenue_at_risk": round(total_at_risk, 2),
        "total_cases": total_cases,
        "revenue_recovered": round(recovered, 2),
        "recovery_rate": recovery_rate,
        "actions_executed": actions_executed,
        "open_escalations": escalations_open,
        "by_event_type": by_type,
    }


@router.get("/recent-cases")
def get_recent_cases(limit: int = 10, db: Session = Depends(get_db)):
    cases = db.query(RecoveryOpportunity).order_by(
        RecoveryOpportunity.created_at.desc()
    ).limit(limit).all()

    result = []
    for c in cases:
        customer = db.query(Customer).filter(Customer.id == c.customer_id).first()
        result.append({
            "id": c.id,
            "type": c.type.value if c.type else None,
            "amount": c.amount,
            "status": c.status.value if c.status else None,
            "recovery_probability": c.recovery_probability,
            "recommended_action": c.recommended_action.value if c.recommended_action else None,
            "customer_name": customer.name if customer else "Unknown",
            "created_at": c.created_at.isoformat() if c.created_at else None,
        })
    return result

@router.get("/recent-trace")
def get_recent_trace(db: Session = Depends(get_db)):
    log = db.query(AuditLog).filter(
        AuditLog.actor == "AI_AGENT",
        AuditLog.action == "STRATEGY_SELECTION",
        AuditLog.reason != "Fast simulated AI decision for bulk batch processing."
    ).order_by(AuditLog.timestamp.desc()).first()
    
    if not log:
        return None
        
    opp = db.query(RecoveryOpportunity).filter(RecoveryOpportunity.id == log.opportunity_id).first()
    if not opp:
        return None
        
    customer = db.query(Customer).filter(Customer.id == opp.customer_id).first()
    transaction = db.query(Transaction).filter(Transaction.id == opp.transaction_id).first()
    
    return {
        "transaction_id": transaction.id if transaction else "N/A",
        "amount": opp.amount,
        "customer_name": customer.name if customer else "Unknown",
        "customer_ltv": customer.lifetime_value if customer else 0,
        "recovery_probability": round((opp.recovery_probability or 0) * 100, 1),
        "strategy": log.outcome,
        "ai_reasoning": log.reason,
        "expected_net_revenue": log.revenue_impact,
        "policy_decision": log.policy_decision,
        "status": opp.status.value if opp.status else "UNKNOWN"
    }
