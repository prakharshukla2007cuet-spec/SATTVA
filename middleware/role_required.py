from functools import wraps

from flask import jsonify

from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity
)

from models.user import User


def role_required(role):

    def decorator(func):

        @wraps(func)
        def wrapper(*args, **kwargs):

            verify_jwt_in_request()

            user_id = get_jwt_identity()

            user = User.query.get(user_id)

            if not user:

                return jsonify({
                    "success": False,
                    "message": "User not found."
                }), 404

            if user.role != role:

                return jsonify({
                    "success": False,
                    "message": "Access Denied."
                }), 403

            return func(*args, **kwargs)

        return wrapper

    return decorator


def admin_required(func):
    return role_required("admin")(func)


def teacher_required(func):
    return role_required("teacher")(func)


def student_required(func):
    return role_required("student")(func)