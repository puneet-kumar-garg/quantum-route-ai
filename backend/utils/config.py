from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://puneetkumargarg@localhost:5432/quantumroute"
    SECRET_KEY: str = "quantum-route-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
