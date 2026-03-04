from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=64, pattern=r"^[a-zA-Z0-9_-]+$")
    password: str = Field(..., min_length=8, max_length=128)
    full_name: Optional[str] = Field(None, max_length=256)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)

class Token(BaseModel):
    access_token: str
    token_type: str

class GoogleOAuthCallback(BaseModel):
    code: str
    state: Optional[str] = None


class SubscriptionResponse(BaseModel):
    """Подписка пользователя (для /users/me или отдельного эндпоинта)."""
    plan: str  # "free" | "premium"
    is_premium: bool
    ai_requests_limit_per_hour: Optional[int] = None  # 5 для free, None для premium
    current_period_end: Optional[datetime] = None  # для premium

