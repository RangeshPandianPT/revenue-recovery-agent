from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.models.domain import Customer, Transaction, RecoveryOpportunity, RecoveryStatus

router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.get("")
def list_customers(db: Session = Depends(get_db)):
    customers = db.query(Customer).limit(50).all()
    result = []
    for c in customers:
        tx_count = db.query(func.count(Transaction.id)).filter(Transaction.customer_id == c.id).scalar() or 0
        tx_success = db.query(func.count(Transaction.id)).filter(Transaction.customer_id == c.id, Transaction.status == "SUCCESS").scalar() or 0
        tx_failed = db.query(func.count(Transaction.id)).filter(Transaction.customer_id == c.id, Transaction.status == "FAILED").scalar() or 0
        
        success_rate = round((tx_success / tx_count * 100) if tx_count > 0 else 100)
        
        rev_at_risk = db.query(func.sum(RecoveryOpportunity.amount)).filter(RecoveryOpportunity.customer_id == c.id).scalar() or 0
        rev_recovered = db.query(func.sum(RecoveryOpportunity.expected_recovery)).filter(RecoveryOpportunity.customer_id == c.id, RecoveryOpportunity.status == RecoveryStatus.RECOVERED).scalar() or 0
        
        prob = db.query(func.avg(RecoveryOpportunity.recovery_probability)).filter(RecoveryOpportunity.customer_id == c.id).scalar() or 0
        
        result.append({
            "id": c.id,
            "name": c.name or "Unknown",
            "email": c.email or "",
            "ltv": c.lifetime_value,
            "transactions": tx_count,
            "successRate": success_rate,
            "failedPayments": tx_failed,
            "revenueAtRisk": rev_at_risk,
            "revenueRecovered": rev_recovered,
            "probability": round(prob * 100),
            "segment": c.segment or "REGULAR",
            "status": "ACTIVE" if tx_failed == 0 else "RECOVERING"
        })
    return {"items": result}
