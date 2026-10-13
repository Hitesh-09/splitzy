from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class ProfileBase(BaseModel):
    display_name: str = Field(..., min_length=1, max_length=100)
    avatar_url: Optional[str] = None
    upi_vpa: Optional[str] = Field(None, pattern=r"^[\w\.\-]+@[\w\-]+$")
    phone: Optional[str] = None


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=1, max_length=100)
    avatar_url: Optional[str] = None
    upi_vpa: Optional[str] = Field(None, pattern=r"^[\w\.\-]+@[\w\-]+$")
    phone: Optional[str] = None


class ProfileResponse(ProfileBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
