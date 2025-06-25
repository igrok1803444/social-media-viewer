from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from auth import  login_user, register_user, refresh_current_user, logout_user
from models.user_models import UserCreate, UserLogin
from routers.telegram_router import router as telegram_router


from dotenv import load_dotenv


load_dotenv()


app = FastAPI()

security = HTTPBearer()

origins = ["http://localhost:5173"] # React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
async def register(data: UserCreate):
    return await register_user(data)

@app.post("/login")
async def login(data: UserLogin ):
    return await login_user(data)

@app.post("/refresh")
async def refresh_user(token=Depends(security)):
    return await refresh_current_user(token.credentials)
    # return current_user_id

@app.post("/logout")
async def protected_route(token=Depends(security)):
    return await logout_user(token.credentials)

app.include_router(telegram_router)