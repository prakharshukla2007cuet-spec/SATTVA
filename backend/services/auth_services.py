from flask import jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity

from database import db
from models import User


# ---------------- Register User ---------------- #

def register_user(data):

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")
    role = data.get("role", "student")

    if not full_name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Full name, email and password are required."
        }), 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Email already registered."
        }), 409

    user = User(
        full_name=full_name,
        email=email,
        phone=phone,
        role=role
    )

    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Registration successful.",
        "user": user.to_dict()
    }), 201


# ---------------- Login User ---------------- #

def login_user(data):

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401

    if not user.check_password(password):
        return jsonify({
            "success": False,
            "message": "Invalid email or password."
        }), 401

    if not user.is_active:
        return jsonify({
            "success": False,
            "message": "Your account has been deactivated."
        }), 403

    access_token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "access_token": access_token,
        "user": user.to_dict()
    }), 200


# ---------------- User Profile ---------------- #

def get_profile():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    if not user:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "user": user.to_dict()
    }), 200