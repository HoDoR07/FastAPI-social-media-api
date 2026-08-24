# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# import psycopg2
# from psycopg2.extras import RealDictCursor
# import time
# from .config import settings
# from dotenv import load_dotenv
# import os

# DATABASE_URL = f"postgresql://{settings.database_username}:{settings.database_password}@{settings.database_hostname}:{settings.database_port}/{settings.database_name}"

# engine = create_engine(DATABASE_URL)

# SessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=engine
# )

# Base = declarative_base()


# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()


# # while True:
# #     try:
# #         conn = psycopg2.connect(
# #             host=settings.database_hostname,
# #             dbname=settings.database_name,
# #             user=settings.database_username,
# #             password=settings.database_password,
# #             port=settings.database_port,
# #             cursor_factory=RealDictCursor
# #         )

# #         cursor = conn.cursor()

# #         print("Database Connected Successfully")
# #         break

# #     except Exception as error:
# #         print("Database Connection Failed")
# #         print("Error:", error)

# #         time.sleep(2)


from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool

from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_USERNAME = os.getenv("DATABASE_USERNAME")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_HOSTNAME = os.getenv("DATABASE_HOSTNAME")
DATABASE_PORT = os.getenv("DATABASE_PORT")
DATABASE_NAME = os.getenv("DATABASE_NAME")


DATABASE_URL = f"postgresql+psycopg2://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOSTNAME}:{DATABASE_PORT}/{DATABASE_NAME}?sslmode=require"

engine = create_engine(
    DATABASE_URL,
    poolclass=NullPool
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


try:
    with engine.connect() as connection:
        print("Database Connected Successfully")
except Exception as error:
    print("Database Connection Failed")
    print("Error:", error)