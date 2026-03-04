"""Rate limit: 5 запросов/час для free. Redis или in-memory."""
import os
import time
from collections import defaultdict

_redis = None
_memory: dict[int, list[float]] = defaultdict(list)
_HOUR = 3600
_LIMIT = 5


def _get_redis():
    global _redis
    if _redis is None and os.getenv("REDIS_URL"):
        try:
            import redis
            _redis = redis.from_url(os.getenv("REDIS_URL"))
        except Exception:
            pass
    return _redis


def check_allowed(user_id: int, limit_per_hour: int | None) -> bool:
    """True если можно сделать запрос. limit_per_hour=None — без лимита (premium)."""
    if limit_per_hour is None:
        return True
    now = time.time()
    cutoff = now - _HOUR
    r = _get_redis()
    if r:
        key = f"ratelimit:{user_id}"
        try:
            r.zremrangebyscore(key, 0, cutoff)
            cnt = r.zcard(key)
            if cnt >= limit_per_hour:
                return False
            r.zadd(key, {str(now): now})
            r.expire(key, _HOUR + 60)
            return True
        except Exception:
            pass
    # fallback in-memory
    lst = _memory[user_id]
    lst[:] = [t for t in lst if t > cutoff]
    if len(lst) >= limit_per_hour:
        return False
    lst.append(now)
    return True
