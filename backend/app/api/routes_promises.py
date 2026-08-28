from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database.session import get_db
from app.models.domain import PromiseToPay, Customer, Invoice

router = APIRouter(prefix="/api/promises", tags=["promises"])

@router.get("")
def list_promises(limit: int = 50, db: Session = Depends(get_db)):
    promises = db.query(PromiseToPay).order_by(desc(PromiseToPay.created_at)).limit(limit).all()
    
    result = []
    for promise in promises:
        customer = db.query(Customer).filter(Customer.id == promise.customer_id).first()
        invoice = db.query(Invoice).filter(Invoice.id == promise.invoice_id).first() if promise.invoice_id else None
        
        result.append({
            "id": promise.id,
            "customer_id": promise.customer_id,
            "customer_name": customer.name if customer else "Unknown",
            "invoice_id": promise.invoice_id,
            "amount": promise.amount,
            "promise_date": promise.promise_date.isoformat() if promise.promise_date else None,
            "status": promise.status.value if hasattr(promise.status, 'value') else promise.status,
            "created_at": promise.created_at.isoformat() if promise.created_at else None,
            "invoice_status": invoice.status if invoice else "UNKNOWN"
        })
    return {"items": result}

@router.post("/{promise_id}/{action}")
def update_promise_status(promise_id: str, action: str, db: Session = Depends(get_db)):
    promise = db.query(PromiseToPay).filter(PromiseToPay.id == promise_id).first()
    if not promise:
        raise HTTPException(status_code=404, detail="Promise not found")
        
    valid_actions = {"kept": "KEPT", "broken": "BROKEN", "cancel": "CANCELLED"}
    if action not in valid_actions:
        raise HTTPException(status_code=400, detail="Invalid action")
        
    promise.status = valid_actions[action]
    db.commit()
    
    return {"status": "success", "message": f"Promise marked as {valid_actions[action]}"}
