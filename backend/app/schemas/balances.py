from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel


class MemberBalanceResponse(BaseModel):
    user_id: UUID
    display_name: str
    avatar_url: Optional[str] = None
    upi_vpa: Optional[str] = None
    total_paid_paise: int
    total_share_paise: int
    net_balance_paise: int  # > 0 means gets back, < 0 means owes


class SimplifiedDebtResponse(BaseModel):
    from_user: UUID
    from_name: str
    to_user: UUID
    to_name: str
    to_upi_vpa: Optional[str] = None
    amount_paise: int


class GroupBalancesResponse(BaseModel):
    group_id: UUID
    total_group_spend_paise: int
    member_balances: List[MemberBalanceResponse]
    simplified_debts: List[SimplifiedDebtResponse]
