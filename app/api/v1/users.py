from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user, get_subscription
from app.models.user import User
from app.models.subscription import Subscription
from app.schemas.user import UserResponse, SubscriptionResponse

router = APIRouter()


@router.get("/me", response_model=dict)
def me(user: User = Depends(get_current_user), sub: Subscription = Depends(get_subscription)):
    return {
        "user": UserResponse.model_validate(user),
        "subscription": SubscriptionResponse(
            plan=sub.plan.value,
            is_premium=sub.is_premium,
            ai_requests_limit_per_hour=sub.ai_requests_limit_per_hour,
            current_period_end=sub.current_period_end,
        ),
    }
