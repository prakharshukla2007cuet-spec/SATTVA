from datetime import datetime

from werkzeug.security import generate_password_hash, check_password_hash

from database.db import db


class User(db.Model):
    __tablename__ = "users"

    # ---------------- Primary Key ---------------- #
    id = db.Column(db.Integer, primary_key=True)

    # ---------------- Personal Details ---------------- #
    full_name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False, index=True)

    phone = db.Column(db.String(15), unique=True, nullable=True)

    # ---------------- Authentication ---------------- #
    password_hash = db.Column(db.String(255), nullable=False)

    # ---------------- Role ---------------- #
    role = db.Column(
        db.String(20),
        nullable=False,
        default="student"
    )  # admin | teacher | student

    # ---------------- Profile ---------------- #
    profile_image = db.Column(
        db.String(255),
        nullable=True,
        default="default.png"
    )

    # ---------------- Status ---------------- #
    is_active = db.Column(db.Boolean, default=True)

    is_verified = db.Column(db.Boolean, default=False)

    # ---------------- Password Reset ---------------- #
    reset_token = db.Column(db.String(255), nullable=True)

    # ---------------- Timestamps ---------------- #
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # ============================================================
    # Password Methods
    # ============================================================

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str):
        return check_password_hash(self.password_hash, password)

    # ============================================================
    # Serialization
    # ============================================================

    def to_dict(self):
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "profile_image": self.profile_image,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    # ============================================================
    # Representation
    # ============================================================

    def __repr__(self):
        return f"<User {self.email}>"