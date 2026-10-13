from fastapi import APIRouter, Depends
from app.core.security import AuthenticatedUser, get_current_user
from app.schemas.common import ApiResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me", response_model=ApiResponse[dict])
async def get_my_auth_profile(user: AuthenticatedUser = Depends(get_current_user)):
    """
    Returns the currently authenticated user's token claims.
    """
    return ApiResponse(
        success=True,
        data={
            "id": user.id,
            "email": user.email,
            "role": user.role
        },
        message="User authenticated successfully"
    )
