import jwt
from datetime import datetime, timedelta
from flask import current_app

def generate_token(user_id):
    return jwt.encode(
        {"id": user_id, "exp": datetime.utcnow() + timedelta(days=1)},
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

def decode_token(token):
    return jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
