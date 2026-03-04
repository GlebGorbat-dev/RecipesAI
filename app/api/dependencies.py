from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode
from app.models.user import User
from app.models.subscription import Subscription

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode(token)
    if payload is None:
        raise credentials_exception
    user_id_str = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception
    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive.")
    return user


def get_subscription(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Subscription:
    from app.models.subscription import SubscriptionPlan
    sub = db.query(Subscription).filter(Subscription.user_id == user.id).first()
    if sub is None:
        sub = Subscription(user_id=user.id, plan=SubscriptionPlan.FREE)
        db.add(sub)
        db.commit()
        db.refresh(sub)
    return sub
