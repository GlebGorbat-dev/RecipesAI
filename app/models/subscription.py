import os
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class SubscriptionPlan(str, enum.Enum):
    FREE = "free"
    PREMIUM = "premium"


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    plan = Column(
        Enum(SubscriptionPlan),
        default=SubscriptionPlan.FREE,
        nullable=False
    )

    stripe_customer_id = Column(String, unique=True, index=True, nullable=True)
    stripe_subscription_id = Column(String, unique=True, index=True, nullable=True)
    current_period_end = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="subscription")

    @property
    def is_premium(self) -> bool:
        return self.plan == SubscriptionPlan.PREMIUM

    @property
    def ai_requests_limit_per_hour(self) -> int | None:
        if self.plan == SubscriptionPlan.PREMIUM:
            return None
        return int(os.getenv("FREE_PLAN_REQUESTS_PER_HOUR", "5"))
