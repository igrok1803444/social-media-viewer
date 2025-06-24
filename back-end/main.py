from dotenv import load_dotenv
import os
from fastapi import FastAPI 
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
print(os.getenv('USER'))

app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {"Hello": "World"}
