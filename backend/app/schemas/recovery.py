from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RecoveryActionBase(BaseModel):
    opportunity_id: str
    action_type: str
    status: Optional[str] = None
    cost: float = 0.0

class RecoveryActionCreate(RecoveryActionBase):
    pass

class RecoveryActionResponse(RecoveryActionBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class PromiseToPayBase(BaseModel):
    customer_id: str
    invoice_id: Optional[str] = None
    amount: float
    promise_date: datetime
    status: Optional[str] = "PENDING"

class PromiseToPayCreate(PromiseToPayBase):
    pass

class PromiseToPayResponse(PromiseToPayBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class EscalationBase(BaseModel):
    opportunity_id: str
    reason: str
    priority: str = "MEDIUM"
    status: str = "OPEN"

class EscalationCreate(EscalationBase):
    pass

class EscalationResponse(EscalationBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
