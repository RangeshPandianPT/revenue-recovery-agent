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

        elif event_type == "payment.failed":
            payment = payload.get("payment", {}).get("entity", {})
            amount = payment.get("amount", 0) / 100.0
            order_id = payment.get("order_id")
            
            if order_id:
                transaction = db.query(Transaction).filter(
                    Transaction.id == order_id
                ).first()

                if transaction:
                    transaction.status = "FAILED"
                    if not transaction.recovery_case:
                        new_opp = RecoveryOpportunity(
                            merchant_id=transaction.merchant_id,
                            customer_id=transaction.customer_id,
                            transaction_id=transaction.id,
                            amount=amount,
                            event_type="PAYMENT_FAILURE",
                            status=RecoveryStatus.PENDING,
                            recovery_probability=0.0
                        )
                        db.add(new_opp)
                        db.commit()
                        db.refresh(new_opp)
                        
                        # Automation Loop: Trigger Agent
                        from app.agents.qwen_agent import OpenRouterAgent
                        from app.services.recovery_service import execute_strategy
                        from app.models.domain import StrategyType
                        
                        agent = OpenRouterAgent()
                        context = {
                            "case_id": new_opp.id,
                            "amount": amount,
                            "event_type": "PAYMENT_FAILURE",
                            "customer_id": new_opp.customer_id,
                            "failure_reason": payment.get("error_description", "Unknown error")
                        }
                        decision = await agent.analyze_and_decide(context)
                        
                        # Update opportunity with probability
                        new_opp.recovery_probability = decision.recovery_probability
                        db.commit()
                        
                        # Execute chosen strategy
                        try:
                            strategy_enum = StrategyType(decision.recommended_strategy)
                        except ValueError:
                            strategy_enum = StrategyType.ESCALATE
                            
                        execute_strategy(db, new_opp.id, strategy_enum, decision.reason)

        elif event_type == "checkout.abandoned":
            payload_data = payload.get("checkout", {}).get("entity", {})
            amount = payload_data.get("amount", 0) / 100.0
            order_id = payload_data.get("order_id", "DEMO-ABANDON-123")
            customer_id = payload_data.get("customer_id", "CUST-ABANDON")
            
            new_opp = RecoveryOpportunity(
                merchant_id="MERCHANT-1",
                customer_id=customer_id,
                transaction_id=order_id,
                amount=amount,
                event_type="CHECKOUT_ABANDONMENT",
                status=RecoveryStatus.PENDING,
                recovery_probability=0.0
            )
            db.add(new_opp)
            db.commit()
            db.refresh(new_opp)
            
            from app.agents.qwen_agent import OpenRouterAgent
            from app.services.recovery_service import execute_strategy
            from app.models.domain import StrategyType
            
            agent = OpenRouterAgent()
            context = {
                "case_id": new_opp.id,
                "amount": amount,
                "event_type": "CHECKOUT_ABANDONMENT",
                "customer_id": new_opp.customer_id,
                "failure_reason": "User abandoned checkout"
            }
            decision = await agent.analyze_and_decide(context)
            new_opp.recovery_probability = decision.recovery_probability
            db.commit()
            try:
                strategy_enum = StrategyType(decision.recommended_strategy)
            except ValueError:
                strategy_enum = StrategyType.ESCALATE
            execute_strategy(db, new_opp.id, strategy_enum, decision.reason)

        elif event_type == "invoice.overdue":
            payload_data = payload.get("invoice", {}).get("entity", {})
            amount = payload_data.get("amount", 0) / 100.0
            invoice_id = payload_data.get("id", "DEMO-INV-123")
            customer_id = payload_data.get("customer_id", "CUST-INV")
            
            new_opp = RecoveryOpportunity(
                merchant_id="MERCHANT-1",
                customer_id=customer_id,
                transaction_id=invoice_id,
                amount=amount,
                event_type="OVERDUE_RECEIVABLE",
                status=RecoveryStatus.PENDING,
                recovery_probability=0.0
            )
            db.add(new_opp)
            db.commit()
            db.refresh(new_opp)
            
            from app.agents.qwen_agent import OpenRouterAgent
            from app.services.recovery_service import execute_strategy
            from app.models.domain import StrategyType
            
            agent = OpenRouterAgent()
            context = {
                "case_id": new_opp.id,
                "amount": amount,
                "event_type": "OVERDUE_RECEIVABLE",
                "customer_id": new_opp.customer_id,
                "failure_reason": "Invoice passed due date"
            }
            decision = await agent.analyze_and_decide(context)
            new_opp.recovery_probability = decision.recovery_probability
            db.commit()
            try:
                strategy_enum = StrategyType(decision.recommended_strategy)
            except ValueError:
                strategy_enum = StrategyType.ESCALATE
            execute_strategy(db, new_opp.id, strategy_enum, decision.reason)

        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
