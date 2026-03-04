from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CreateSubscriptionResponse(BaseModel):
    checkout_url: str


class SubscriptionStatusResponse(BaseModel):
    plan: str
    is_premium: bool
    ai_requests_limit_per_hour: Optional[int] = None
    current_period_end: Optional[datetime] = None
    stripe_customer_id: Optional[str] = None
