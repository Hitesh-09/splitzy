from typing import Optional
from uuid import UUID
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel
from app.core.config import settings

security = HTTPBearer(auto_error=False)


class AuthenticatedUser(BaseModel):
    id: str
    email: Optional[str] = None
    role: str = "authenticated"


async def get_current_user(
    auth_header: Optional[HTTPAuthorizationCredentials] = Depends(security),
    x_mock_user_id: Optional[str] = Header(None, alias="X-Mock-User-Id")
) -> AuthenticatedUser:
    """
    Validates Supabase JWT from Authorization header.
    In development or test mode, accepts X-Mock-User-Id header for fast integration testing.
    """
    if settings.ENVIRONMENT in ("development", "test") and x_mock_user_id:
        try:
            # Validate UUID format
            UUID(x_mock_user_id)
            return AuthenticatedUser(
                id=x_mock_user_id,
                email=f"mock-{x_mock_user_id[:8]}@splitzy.local",
                role="authenticated"
            )
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid mock UUID in X-Mock-User-Id header"
            )

    if not auth_header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth_header.credentials
    try:
        # Decode Supabase JWT
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        user_id: Optional[str] = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject"
            )
        return AuthenticatedUser(
            id=user_id,
            email=payload.get("email"),
            role=payload.get("role", "authenticated")
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
