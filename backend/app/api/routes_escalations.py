from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.models.domain import Escalation, RecoveryOpportunity, Customer, AuditLog

router = APIRouter(prefix="/api/escalations", tags=["escalations"])

@router.get("")
def list_escalations(limit: int = 50, db: Session = Depends(get_db)):
    escalations = db.query(Escalation).order_by(desc(Escalation.created_at)).limit(limit).all()
    
    result = []
    for esc in escalations:
        opp = db.query(RecoveryOpportunity).filter(RecoveryOpportunity.id == esc.opportunity_id).first()
        customer = None
        if opp:
            customer = db.query(Customer).filter(Customer.id == opp.customer_id).first()
            
        result.append({
            "id": esc.id,
            "opportunity_id": esc.opportunity_id,
            "reason": esc.reason,
            "priority": esc.priority,
            "status": esc.status,
            "created_at": esc.created_at.isoformat() if esc.created_at else None,
            "amount": opp.amount if opp else 0,
            "risk_type": opp.type.value if opp and opp.type else "UNKNOWN",
            "customer_name": customer.name if customer else "Unknown",
            "ai_recommendation": opp.recommended_action.value if opp and opp.recommended_action else "None",
        })
    return {"items": result}

@router.post("/{escalation_id}/{action}")
def handle_escalation(escalation_id: str, action: str, db: Session = Depends(get_db)):
    escalation = db.query(Escalation).filter(Escalation.id == escalation_id).first()
    if not escalation:
        raise HTTPException(status_code=404, detail="Escalation not found")
        
    valid_actions = ["approve", "reject", "close", "recover"]
    if action not in valid_actions:
        raise HTTPException(status_code=400, detail="Invalid action")
        
    # Update escalation status
    if action in ["close", "recover"]:
        escalation.status = "CLOSED"
        
    # Create audit log for human action
    opp = db.query(RecoveryOpportunity).filter(RecoveryOpportunity.id == escalation.opportunity_id).first()
    audit_log = AuditLog(
        merchant_id=opp.merchant_id if opp else "default",
        opportunity_id=escalation.opportunity_id,
        actor="ADMIN",
        action=f"ESCALATION_{action.upper()}",
        reason=f"Human manually chose to {action} this escalation.",
        policy_decision="N/A",
        outcome=f"Escalation {action}d"
    )
    db.add(audit_log)
    db.commit()
    
    return {"status": "success", "message": f"Escalation {action}d successfully"}
