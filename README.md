# FastAPI-social-media-api

🚀 FastAPI Social Media API

A RESTful Social Media API built with FastAPI, PostgreSQL, SQLAlchemy, Alembic, and JWT Authentication.

The API allows users to register and log in, create and manage posts, and vote on posts.

✨ Features
👤 User Registration
🔐 User Login & Authentication
🎟️ JWT-based Authentication
📝 Create Posts
📖 Read Posts
✏️ Update Posts
🗑️ Delete Posts
👍 Vote on Posts
🔒 Protected API Endpoints
🗄️ PostgreSQL Database
🧩 SQLAlchemy ORM
🔄 Alembic Database Migrations
✅ Pydantic Data Validation
📚 Automatic API Documentation with Swagger UI
🛠️ Tech Stack
Technology	Purpose
Python	Backend Programming
FastAPI	REST API Framework
PostgreSQL	Relational Database
SQLAlchemy	ORM
Pydantic	Data Validation
Alembic	Database Migrations
JWT	Authentication
Psycopg2	PostgreSQL Driver
Uvicorn	ASGI Server
Postman	API Testing
📁 Project Structure
fastapi-social-media-api/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── oauth2.py
│   ├── config.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── post.py
│   │   ├── user.py
│   │   └── vote.py
│   │
│   └── ...
│
├── alembic/
│   ├── versions/
│   ├── env.py
│   └── script.py.mako
│
├── .env
├── .gitignore
├── alembic.ini
├── requirements.txt
└── README.md

Folder names may vary depending on the final project structure.

⚙️ Installation
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/fastapi-social-media-api.git
2. Navigate to the project
cd fastapi-social-media-api
3. Create a virtual environment
python -m venv venv
4. Activate the virtual environment
Windows
venv\Scripts\activate
Linux / macOS
source venv/bin/activate
5. Install dependencies
pip install -r requirements.txt



▶️ Running the Application

Start the FastAPI server using Uvicorn:

uvicorn app.main:app --reload

The API will be available at:

http://127.0.0.1:8000


📚 API Documentation

FastAPI automatically provides interactive API documentation.

Swagger UI
http://127.0.0.1:8000/docs
ReDoc
http://127.0.0.1:8000/redoc

You can use Swagger UI to test the API endpoints directly from the browser.


🔑 Authentication Flow

The authentication flow works approximately like this:

User
 │
 ├── Register
 │      ↓
 │   User Created
 │
 ├── Login
 │      ↓
 │   Verify Credentials
 │      ↓
 │   Generate JWT Token
 │
 └── Send JWT Token
        ↓
   Protected Endpoints

Protected requests use:

Authorization: Bearer <access_token>


📝 Posts

Authenticated users can create posts.

Example request:

{
    "title": "My First Post",
    "content": "This is my first post."
}

Users can perform operations such as:

CREATE  → Create a post
READ    → Get posts
UPDATE  → Update a post
DELETE  → Delete a post
👍 Voting System

Users can vote on posts.

The voting system uses a relationship between users and posts:

users
   │
   │ user_id
   ↓
votes
   ↑
   │ post_id
   │
posts

The votes table uses:

user_id
post_id

as a composite primary key to help prevent the same user from voting on the same post more than once.

🗃️ Database Relationships

The project uses PostgreSQL with SQLAlchemy ORM.

Main entities include:

Users
  │
  ├────────── Posts
  │
  └────────── Votes
                  │
                  └────────── Posts

Foreign keys are used to maintain relationships between users, posts, and votes.

🧪 API Testing

The API can be tested using Postman or the built-in Swagger UI.

Typical workflow:

1. Register User
       ↓
2. Login
       ↓
3. Get JWT Token
       ↓
4. Authorize Request
       ↓
5. Create Post
       ↓
6. Read / Update / Delete Post
       ↓
7. Vote on Post
🔄 Database Migration Workflow

This project uses Alembic for database schema management.

Modify SQLAlchemy Model
          ↓
alembic revision --autogenerate
          ↓
Migration File
          ↓
alembic upgrade head
          ↓
PostgreSQL Database Updated
🔒 Security

The project implements:

JWT-based authentication
Password hashing
Protected routes
Environment variables for sensitive configuration
Database constraints and foreign keys
Input validation using Pydantic

