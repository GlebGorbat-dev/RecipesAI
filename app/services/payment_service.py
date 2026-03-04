
import os
import stripe
from sqlalchemy.orm import Session
from app.core.config import settings

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
PRICE_ID = os.getenv("STRIPE_PRICE_ID_PREMIUM")
WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")


def create_checkout_session(user_id: int, email: str, success_url: str | None = None, cancel_url: str | None = None) -> str:
    """URL для редиректа на Stripe Checkout."""
    session = stripe.checkout.Session.create(
        customer_email=email,
        line_items=[{"price": PRICE_ID, "quantity": 1}],
        mode="subscription",
        success_url=success_url or f"{settings.FRONTEND_URL}/payments/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=cancel_url or f"{settings.FRONTEND_URL}/payments/cancel",
        metadata={"user_id": str(user_id)},
    )
    return session.url


def construct_webhook_event(payload: bytes, sig: str):
    """Верификация и парсинг webhook. Raises stripe.SignatureVerificationError."""
    return stripe.Webhook.construct_event(payload, sig, WEBHOOK_SECRET)


def handle_checkout_completed(session: dict, db: Session) -> None:
    """Обработка checkout.session.completed: upgrade подписки."""
    from app.models import Subscription, User
    from app.models.subscription import SubscriptionPlan
    from datetime import datetime, timezone
    import logging

    metadata = session.get("metadata") or {}
    user_id = metadata.get("user_id")
    if not user_id:
        email = session.get("customer_email") or session.get("customer_details", {}).get("email")
        if email:
            user = db.query(User).filter(User.email == email).first()
            if user:
                user_id = str(user.id)
    if not user_id:
        logging.warning("Checkout completed but no user_id in metadata and could not resolve by email")
        return
    sub = db.query(Subscription).filter(Subscription.user_id == int(user_id)).first()
    if not sub:
        return
    sub.plan = SubscriptionPlan.PREMIUM
    sub.stripe_subscription_id = session.get("subscription")
    sub.stripe_customer_id = session.get("customer")
    sub_id = session.get("subscription")
    if sub_id:
        sub_obj = stripe.Subscription.retrieve(sub_id)
        if sub_obj.current_period_end:
            sub.current_period_end = datetime.fromtimestamp(sub_obj.current_period_end, tz=timezone.utc)
    db.commit()
