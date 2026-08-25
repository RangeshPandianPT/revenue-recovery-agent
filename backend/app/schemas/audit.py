from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AuditLogBase(BaseModel):
    merchant_id: str
    opportunity_id: Optional[str] = None
    actor: str
    action: str
    reason: Optional[str] = None
    policy_decision: Optional[str] = None
    outcome: Optional[str] = None
    revenue_impact: Optional[float] = 0.0

class AuditLogCreate(AuditLogBase):
    pass

class AuditLogResponse(AuditLogBase):
    id: str
    timestamp: datetime

    class Config:
        orm_mode = True

class AuditLogList(BaseModel):
    items: List[AuditLogResponse]
    total: int
