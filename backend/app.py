from flask import Flask
from flask_cors import CORS
from utils.db import db
from controllers.auth_controller import auth_bp
from controllers.project_controller import project_bp
from controllers.task_controller import task_bp
from controllers.progress_controller import progress_bp
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(project_bp, url_prefix="/api/projects")
    app.register_blueprint(task_bp, url_prefix="/api/tasks")
    app.register_blueprint(progress_bp, url_prefix="/api/progress")
    
    from controllers.stats_controller import stats_bp
    app.register_blueprint(stats_bp, url_prefix="/api/stats")
    
    from controllers.issue_controller import issue_bp
    app.register_blueprint(issue_bp, url_prefix="/api/issues")

    from controllers.comment_controller import comment_bp
    app.register_blueprint(comment_bp, url_prefix="/api/comments")

    from controllers.attachment_controller import attachment_bp
    app.register_blueprint(attachment_bp, url_prefix="/api/attachments")

    from controllers.tracking_controller import tracking_bp
    app.register_blueprint(tracking_bp, url_prefix="/api/tracking")

    from controllers.user_controller import user_bp
    app.register_blueprint(user_bp, url_prefix="/api/users")

    @app.route("/")
    def home():
        return {"status": "IoT Tracking Backend Running"}
    
    @app.errorhandler(Exception)
    def handle_exception(e):
        return {"error": str(e), "type": type(e).__name__}, 500

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000)
