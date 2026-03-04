import os
import pathlib
from functools import lru_cache
from smtplib import SMTP_PORT

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from openai import AsyncClient


load_dotenv()


class BaseConfig:
    BASE_DIR: pathlib.Path = pathlib.Path(__file__).parent.parent.parent
    DATABASE_URL = os.getenv('DATABASE_URL')

    LLM = ChatOpenAI(model="gpt-4.1-mini", temperature=0.3, use_responses_api=True)
    OPENAI_CLIENT = AsyncClient(api_key=os.getenv('OPENAI_API_KEY'))
    VS_ID = os.getenv('VS_ID')

    SECRET_KEY = os.getenv('SECRET_KEY')
    ALGORITHM = os.getenv('ALGORITHM')
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '60'))

    FRONTEND_URL: str = "http://localhost:3000"

    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')

    SMTP_HOST = os.getenv('SMTP_HOST')
    SMTP_PORT = os.getenv('SMTP_PORT')
    SMTP_USER = os.getenv('SMTP_USER')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
    SMTP_FROM_EMAIL = os.getenv('SMTP_FROM_EMAIL')
    SMTP_FROM_NAME = os.getenv('SMTP_FROM_NAME')


class DevelopmentConfig(BaseConfig):
    Issuer = "http://localhost:8000"
    Audience = "http://localhost:3000"


class ProductionConfig(BaseConfig):
    Issuer = ""
    Audience = ""


@lru_cache()
def get_settings() -> DevelopmentConfig | ProductionConfig:
    """Определяет активную конфигурацию по переменной окружения и кеширует результат."""
    config_cls_dict = {
        'development': DevelopmentConfig,
        'production': ProductionConfig,
    }
    config_name = os.getenv('FASTAPI_CONFIG', default='development')
    config_cls = config_cls_dict[config_name]
    return config_cls()


settings = get_settings()