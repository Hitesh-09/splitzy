from datetime import datetime
from typing import Dict, List, Literal, Optional
from uuid import UUID
from pydantic import BaseModel, Field, model_validator


ExpenseCategoryType = Literal[
    "rent",
    "groceries",
    "electricity",
    "wifi",
    "maid",
    "water",
    "food",
    "travel",
    "miscellaneous"
]

SplitTypeLiteral = Literal["equal", "exact", "percentage", "shares"]


class ExpenseSplitInput(BaseModel):
    user_id: UUID
    share_paise: Optional[int] = Field(None, ge=0)
    percentage: Optional[float] = Field(None, ge=0, le=100)
    shares: Optional[int] = Field(None, ge=1)


class ExpenseCreate(BaseModel):
    group_id: UUID
    paid_by: UUID
    description: str = Field(..., min_length=1, max_length=255)
    category: ExpenseCategoryType = "miscellaneous"
    amount_paise: int = Field(..., gt=0)
    split_type: SplitTypeLiteral = "equal"
    receipt_url: Optional[str] = None
    occurred_at: Optional[datetime] = None
    # For equal split, list of user IDs who participate
    participant_ids: Optional[List[UUID]] = None
    # For custom splits
    custom_splits: Optional[List[ExpenseSplitInput]] = None


class ExpenseSplitResponse(BaseModel):
    expense_id: UUID
    group_id: UUID
    user_id: UUID
    share_paise: int

    class Config:
        from_attributes = True


class ExpenseResponse(BaseModel):
    id: UUID
    group_id: UUID
    paid_by: UUID
    created_by: UUID
    description: str
    category: str
    amount_paise: int
    split_type: str
    receipt_url: Optional[str] = None
    occurred_at: datetime
    created_at: datetime
    updated_at: datetime
    splits: List[ExpenseSplitResponse] = []

    class Config:
        from_attributes = True
