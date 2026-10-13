from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, Field
from app.schemas.profiles import ProfileResponse


class GroupBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    currency: str = Field("INR", pattern=r"^[A-Z]{3}$")


class GroupCreate(GroupBase):
    initial_member_ids: Optional[List[UUID]] = []


class GroupMemberResponse(BaseModel):
    user_id: UUID
    role: str
    status: str
    joined_at: datetime
    profile: Optional[ProfileResponse] = None

    class Config:
        from_attributes = True


class GroupResponse(GroupBase):
    id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime
    members: Optional[List[GroupMemberResponse]] = []

    class Config:
        from_attributes = True


class AddMemberRequest(BaseModel):
    user_id: UUID
    role: str = Field("member", pattern=r"^(admin|member)$")
