from fastapi import APIRouter, Depends, HTTPException, status
from app.api.dependencies import get_current_user, get_subscription
from app.models.user import User
from app.models.subscription import Subscription
from app.schemas.recipe import RecipeAskRequest, RecipeAskResponse
from app.services.rag_engine import ask
from app.services.rate_limiter import check_allowed

router = APIRouter()


@router.post("/ask", response_model=RecipeAskResponse)
async def recipe_ask(
    body: RecipeAskRequest,
    user: User = Depends(get_current_user),
    sub: Subscription = Depends(get_subscription),
):
    limit = sub.ai_requests_limit_per_hour
    if not check_allowed(user.id, limit):
        msg = f"Request limit reached. {limit} requests per hour for the free plan."
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=msg)
    return await ask(body.question, body.history)
