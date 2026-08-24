from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.batch import RecoveryBatchResponse, RunBatchRequest
from app.models.domain import RecoveryBatch
from app.services.batch_service import run_batch_simulation

router = APIRouter(prefix="/api/batches", tags=["batches"])

@router.get("/", response_model=list[RecoveryBatchResponse])
def list_batches(db: Session = Depends(get_db)):
    return db.query(RecoveryBatch).order_by(RecoveryBatch.created_at.desc()).all()

@router.get("/{batch_id}", response_model=RecoveryBatchResponse)
def get_batch(batch_id: str, db: Session = Depends(get_db)):
    batch = db.query(RecoveryBatch).filter(RecoveryBatch.id == batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch

@router.post("/run", response_model=RecoveryBatchResponse)
def run_batch(request: RunBatchRequest, db: Session = Depends(get_db)):
    batch = run_batch_simulation(db, request.merchant_id, request.case_count)
    if not batch:
        raise HTTPException(status_code=400, detail="Could not create batch. No pending opportunities found.")
    return batch
