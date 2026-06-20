from typing import ClassVar

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Lingzhi Starter API"
    app_env: str = "development"
    app_version: str = "0.1.0"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5433/lingzhi_app"
    frontend_origin: str = "http://localhost:5173"
    image_api_base_url: str = "https://ark.cn-beijing.volces.com/api/v3"
    image_api_key: str = ""
    image_model: str = "doubao-seedream-5-0-260128"
    image_default_size: str = "2K"
    image_watermark: bool = True

    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
