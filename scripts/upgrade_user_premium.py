"""Manually upgrade a user to Premium (e.g. if webhook failed). Usage: python scripts/upgrade_user_premium.py <email>"""
import os
import sys

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

def main():
    email = sys.argv[1] if len(sys.argv) > 1 else None
    if not email:
        print("Usage: python scripts/upgrade_user_premium.py <email>")
        sys.exit(1)

    from sqlalchemy import create_engine, text

    engine = create_engine(os.getenv("DATABASE_URL"))
    with engine.connect() as conn:
        r = conn.execute(text("SELECT id FROM users WHERE email = :e"), {"e": email}).fetchone()
        if not r:
            print(f"User not found: {email}")
            sys.exit(1)
        user_id = r[0]
        # Check enum values (PostgreSQL stores them in pg_enum)
        enum_vals = conn.execute(text(
            "SELECT enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'subscriptionplan'"
        )).fetchall()
        premium_val = "premium" if any(row[0] == "premium" for row in enum_vals) else "PREMIUM"
        conn.execute(text("UPDATE subscriptions SET plan = CAST(:p AS subscriptionplan) WHERE user_id = :uid"), {"p": premium_val, "uid": user_id})
        conn.commit()
    print(f"Upgraded {email} to Premium")

if __name__ == "__main__":
    main()
