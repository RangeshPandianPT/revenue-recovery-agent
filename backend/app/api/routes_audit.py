from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from app.database.session import get_db
from app.models.domain import AuditLog
from app.schemas.audit import AuditLogResponse, AuditLogList

router = APIRouter(prefix="/api/audit", tags=["audit"])

@router.get("", response_model=AuditLogList)
def get_audit_logs(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    actor: Optional[str] = None,
    action: Optional[str] = None,
    opportunity_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)
    
    if actor:
        query = query.filter(AuditLog.actor == actor)
    if action:
        query = query.filter(AuditLog.action == action)
    if opportunity_id:
        query = query.filter(AuditLog.opportunity_id == opportunity_id)
        
    total = query.count()
    logs = query.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()
    
    return {"items": logs, "total": total}

@router.post("", response_model=AuditLogResponse)
def create_audit_log(
    log_in: dict,
    db: Session = Depends(get_db)
):
    # This might be an internal endpoint or only used for testing/demo
    # In production, services would call database directly to create audit logs
    new_log = AuditLog(**log_in)
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log
