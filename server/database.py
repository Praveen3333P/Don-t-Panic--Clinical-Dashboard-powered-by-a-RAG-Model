from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# We're keeping things simple for now with a local SQLite file to store our user profiles
SQLALCHEMY_DATABASE_URL = "sqlite:///./clinical_zen.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
