from fastapi import APIRouter
from app.api.v1.auth import router as auth_router

api_v1_router = APIRouter(prefix="/api/v1")

# Include subrouters
api_v1_router.include_router(auth_router)
