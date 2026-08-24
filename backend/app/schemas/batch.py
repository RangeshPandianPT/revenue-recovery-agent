from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BatchCaseBase(BaseModel):
    batch_id: str
    opportunity_id: str
    status: str = "PENDING"

class BatchCaseResponse(BatchCaseBase):
    id: str
    
    class Config:
        from_attributes = True

class RecoveryBatchBase(BaseModel):
    merchant_id: str
    total_cases: int = 0
    revenue_at_risk: float = 0.0
    recoverable_cases: int = 0
    actions_executed: int = 0
    successful_recoveries: int = 0
    gross_revenue_recovered: float = 0.0
    recovery_costs: float = 0.0
    net_revenue_recovered: float = 0.0
    status: str = "PENDING"

class RecoveryBatchCreate(RecoveryBatchBase):
    pass

class RecoveryBatchResponse(RecoveryBatchBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class RunBatchRequest(BaseModel):
    merchant_id: str
    case_count: int = 1000
