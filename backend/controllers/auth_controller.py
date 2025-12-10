from flask import Blueprint, request
from models.user import User
from utils.db import db
from utils.jwt_utils import generate_token
from werkzeug.security import check_password_hash, generate_password_hash

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/login")
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password, data["password"]):
        return {"error": "Invalid credentials"}, 401
    
    if not user.is_approved:
        return {"error": "Your account is pending approval from an administrator"}, 403

    token = generate_token(user.id)
    return {"token": token, "user": {"name": user.name, "role": user.role}}

@auth_bp.post("/register")
def register():
    data = request.json
    if User.query.filter_by(email=data["email"]).first():
        return {"error": "User already exists"}, 400
    
    hashed_password = generate_password_hash(data["password"])
    # Explicitly set is_approved to False (though default is False)
    user = User(name=data["name"], email=data["email"], password=hashed_password, role=data.get("role", "user"), is_approved=False)
    db.session.add(user)
    db.session.commit()
    return {"message": "User created successfully"}
