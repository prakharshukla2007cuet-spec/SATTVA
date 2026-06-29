from flask import Flask
from database.db import db
from routes.auth_routes import auth

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///sattva.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

app.register_blueprint(auth, url_prefix="/api")

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return "SATTVA Backend Running Successfully 🚀"


if __name__ == "__main__":
    app.run(debug=True)
