from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from app.database.session import get_db
from app.models.domain import RecoveryOpportunity

router = APIRouter(prefix="/api/simulator", tags=["simulator"])

class SimulatorRequest(BaseModel):
    revenueRisk: float
    cases: int
    avgTransaction: float

@router.post("/run")
def run_simulation(req: SimulatorRequest, db: Session = Depends(get_db)):
    # Dynamically read the average recovery probability from synthetic database data
    avg_recovery_prob = db.query(func.avg(RecoveryOpportunity.recovery_probability)).scalar() or 0.60
    
    # If the database average is 0 (uninitialized), default to a realistic AI performance
    if avg_recovery_prob < 0.1:
        avg_recovery_prob = 0.65

    rule_based_recovery_rate = 0.25 # Industry standard static baseline
    ai_recovery_rate = float(avg_recovery_prob)

    rule_recovered = req.revenueRisk * rule_based_recovery_rate
    ai_recovered = req.revenueRisk * ai_recovery_rate

    # Execution Costs
    rule_cost_per_case = 15
    ai_cost_per_case = 5

    return {
        "ruleBased": {
            "recovered": rule_recovered,
            "net": rule_recovered - (req.cases * rule_cost_per_case),
            "cost": req.cases * rule_cost_per_case,
            "rate": round(rule_based_recovery_rate * 100, 1)
        },
        "ai": {
            "recovered": ai_recovered,
            "net": ai_recovered - (req.cases * ai_cost_per_case),
            "cost": req.cases * ai_cost_per_case,
            "rate": round(ai_recovery_rate * 100, 1)
        }
    }
