from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Documind.AI"
    VERSION: str = "2.0.0"
    
    # Vector DB settings
    VECTOR_STORE_PATH: str = "data/vectorstore"
    
    # Model settings
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    LLM_MODEL: str = "llama3-8b-8192" # Groq model
    LLM_PROVIDER: str = "groq" # 'groq', 'openai', 'ollama'
    
    # API Keys
    GROQ_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # RAG settings
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K: int = 4
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
