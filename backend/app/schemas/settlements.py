from datetime import datetime
from typing import Literal, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from app.schemas.profiles import ProfileResponse

SettlementStatusLiteral = Literal["pending", "processing", "completed", "failed", "cancelled"]


class SettlementCreate(BaseModel):
    group_id: UUID
    to_user: UUID
    amount_paise: int = Field(..., gt=0)
    notes: Optional[str] = None


class SettlementResponse(BaseModel):
    id: UUID
    group_id: UUID
    from_user: UUID
    to_user: UUID
    amount_paise: int
    status: SettlementStatusLiteral
    notes: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    from_profile: Optional[ProfileResponse] = None
    to_profile: Optional[ProfileResponse] = None

    class Config:
        from_attributes = True


class UpiIntentResponse(BaseModel):
    settlement_id: UUID
    upi_uri: str
    pa: str  # Payee VPA
    pn: str  # Payee Name
    am: str  # Amount (Rupees formatted string, e.g. "500.00")
    cu: str = "INR"
    tn: str  # Transaction Note
