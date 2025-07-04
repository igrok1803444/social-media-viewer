from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.telegram_router import router as telegram_router
from routers.users_router import router as users_router
from database.database import setup_indexes


from dotenv import load_dotenv


load_dotenv()


app = FastAPI()


@app.on_event("startup")
async def startup_event():
    await setup_indexes()


origins = ["http://localhost:5173"]  # React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(telegram_router)
