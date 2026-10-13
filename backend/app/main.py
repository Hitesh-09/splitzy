from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.errors import AppException
from app.schemas.common import HealthResponse

app = FastAPI(
    title="Splitzy API",
    description="AI-powered mobile expense sharing and UPI settlement backend",
    version="0.1.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "code": exc.code,
            "message": exc.detail,
            "extra": exc.extra
        }
    )


@app.get("/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    return HealthResponse(
        status="ok",
        version="0.1.0",
        environment=settings.ENVIRONMENT
    )


@app.get("/", tags=["root"])
async def root():
    return {
        "name": "Splitzy API",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health"
    }


# Mount API V1
app.include_router(api_v1_router)
