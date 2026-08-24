from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from .routers import post, user, auth, vote


app = FastAPI()


# ==========================================
# CORS
# ==========================================

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# STATIC FILES
# ==========================================

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)


# ==========================================
# TEMPLATES
# ==========================================

templates = Jinja2Templates(
    directory="templates"
)


# ==========================================
# FRONTEND
# ==========================================

@app.get("/")
def root(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )


# ==========================================
# API ROUTERS
# ==========================================

app.include_router(
    post.router
)

app.include_router(
    user.router
)

app.include_router(
    auth.router
)

app.include_router(
    vote.router
)