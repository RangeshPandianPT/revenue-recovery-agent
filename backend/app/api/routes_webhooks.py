from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import json
import os

from app.database.session import get_db
from app.services.razorpay_service import razorpay_service
from app.models.domain import RecoveryOpportunity, RecoveryStatus, Transaction

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

@router.post("/razorpay")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Razorpay webhooks for payment updates"""
    webhook_secret = os.environ.get("RAZORPAY_WEBHOOK_SECRET")
    signature = request.headers.get("x-razorpay-signature")
    
    body = await request.body()
    body_str = body.decode('utf-8')
    
    if not razorpay_service._is_mock() and webhook_secret and signature:
        if not razorpay_service.verify_webhook_signature(body_str, signature, webhook_secret):
            raise HTTPException(status_code=400, detail="Invalid signature")

    try:
        event_data = json.loads(body_str)
        event_type = event_data.get("event")
        payload = event_data.get("payload", {})

        if event_type == "payment_link.paid":
            plink = payload.get("payment_link", {}).get("entity", {})
            reference_id = plink.get("reference_id")
            
            # If reference ID is tied to a recovery opportunity, mark as recovered
            if reference_id:
                # Find by transaction or opportunity ID
                opp = db.query(RecoveryOpportunity).filter(
                    RecoveryOpportunity.id == reference_id
                ).first()
                
                if opp:
                    opp.status = RecoveryStatus.RECOVERED
                    opp.updated_at = datetime.utcnow()
                    db.commit()

        elif event_type == "payment.captured":
            payment = payload.get("payment", {}).get("entity", {})
            order_id = payment.get("order_id")
            
            if order_id:
                # Basic update logic, depends on how orders map to transactions
                transaction = db.query(Transaction).filter(
                    Transaction.id == order_id
                ).first()
                if transaction:
                    transaction.status = "SUCCESS"
                    db.commit()
                    
                    if transaction.recovery_case:
                        transaction.recovery_case.status = RecoveryStatus.RECOVERED
                        db.commit()

        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
