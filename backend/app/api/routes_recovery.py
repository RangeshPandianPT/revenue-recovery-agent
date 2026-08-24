from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.recovery import RecoveryActionResponse, PromiseToPayResponse, EscalationResponse
from app.models.domain import StrategyType, RecoveryOpportunity, Escalation, PromiseToPay, RecoveryAction
from app.services.recovery_service import execute_strategy

router = APIRouter(prefix="/api/recovery", tags=["recovery"])

@router.post("/execute/{opportunity_id}", response_model=RecoveryActionResponse)
def execute_recovery_action(
    opportunity_id: str,
    strategy: str,
    details: str = "",
    db: Session = Depends(get_db)
):
    try:
        strategy_enum = StrategyType(strategy)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid strategy type")

    action = execute_strategy(db, opportunity_id, strategy_enum, details)
    if not action:
        raise HTTPException(status_code=404, detail="Opportunity not found")
        
    return action

@router.get("/escalations", response_model=list[EscalationResponse])
def get_escalations(db: Session = Depends(get_db)):
    return db.query(Escalation).all()

@router.get("/promises", response_model=list[PromiseToPayResponse])
def get_promises(db: Session = Depends(get_db)):
    return db.query(PromiseToPay).all()
