from pydantic import BaseSettings
from functools import lru_cache
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost:3306/salonease")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

settings = get_settings()
