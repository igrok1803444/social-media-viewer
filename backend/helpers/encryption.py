from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

load_dotenv()

FERNET_KEY = os.getenv("FERNET_KEY")

if not FERNET_KEY:
    raise Exception("FERNET_KEY not set. Generate one using Fernet.generate_key().")

fernet = Fernet(FERNET_KEY)

def encrypt_string(data: str) -> str:
    return fernet.encrypt(data.encode()).decode()

def decrypt_string(token: str) -> str:
    return fernet.decrypt(token.encode()).decode()
