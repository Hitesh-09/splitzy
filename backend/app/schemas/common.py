from typing import Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "0.1.0"
    environment: str


def rupees_to_paise(rupees: float) -> int:
    """Converts a rupee float/int to integer paise with proper rounding."""
    return int(round(rupees * 100))


def paise_to_rupees_str(paise: int) -> str:
    """Formats integer paise into standard 2-decimal INR string (e.g. 12050 -> '120.50')."""
    return f"{paise / 100:.2f}"
