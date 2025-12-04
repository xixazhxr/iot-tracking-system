import os

class Config:
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://root:asdfghjkl@localhost/project_management"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "supersecretkey"
