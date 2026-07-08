from functools import wraps

from flask import jsonify
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity
)

from models.user import User


def login_required(func):
    """
    Verify JWT Token
    """

    @wraps(func)
    def wrapper(*args, **kwargs):

        try:
            verify_jwt_in_request()

            user_id = get_jwt_identity()

            user = User.query.get(user_id)

            if not user:
                return jsonify({
                    "success": False,
                    "message": "User not found."
                }), 404

            if not user.is_active:
                return jsonify({
                    "success": False,
                    "message": "Account is disabled."
                }), 403

            return func(*args, **kwargs)

        except Exception:

            return jsonify({
                "success": False,
                "message": "Invalid or expired token."
            }), 401

    return wrapper