from fastapi import APIRouter, Depends, Request, HTTPException
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.services.payment_service import create_checkout_session, construct_webhook_event, handle_checkout_completed
from sqlalchemy.orm import Session
import stripe

router = APIRouter()


@router.post("/create-subscription")
def create_subscription(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    url = create_checkout_session(user.id, user.email)
    return {"checkout_url": url}


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    import logging
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")
    logging.info("Stripe webhook received, sig present: %s", bool(sig))
    try:
        event = construct_webhook_event(payload, sig)
    except stripe.SignatureVerificationError as e:
        logging.error("Stripe webhook signature FAILED: %s", e)
        raise HTTPException(status_code=400, detail="Invalid signature")
    logging.info("Stripe event type: %s", event["type"])
    if event["type"] == "checkout.session.completed":
        session_obj = event["data"]["object"]
        metadata = session_obj.get("metadata") or {}
        logging.info(
            "Checkout completed: user_id=%s, email=%s, subscription=%s",
            metadata.get("user_id"),
            session_obj.get("customer_email"),
            session_obj.get("subscription"),
        )
        handle_checkout_completed(session_obj, db)
        logging.info("Premium upgrade applied for user_id=%s", metadata.get("user_id"))
    return {"received": True}


@router.post("/verify-session")
async def verify_session(request: Request, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Fallback: verify checkout session and upgrade if webhook was missed."""
    import logging
    body = await request.json()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")
    try:
        session_obj = stripe.checkout.Session.retrieve(session_id)
    except Exception as e:
        logging.error("Failed to retrieve session %s: %s", session_id, e)
        raise HTTPException(status_code=400, detail="Invalid session")
    if session_obj.payment_status != "paid":
        raise HTTPException(status_code=400, detail="Payment not completed")
    handle_checkout_completed(dict(session_obj), db)
    logging.info("Premium applied via verify-session for user_id=%s", user.id)
    return {"status": "premium_applied"}
