import bcrypt

def hash_password(password:str):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode()
    return hashed_password

def match_password(plain_password:str, hashed_password:str ):
     is_matched = bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
     return is_matched