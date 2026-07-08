from flask_jwt_extended import JWTManager

jwt = JWTManager()


def init_jwt(app):
    """
    Initialize JWT Extension
    """

    jwt.init_app(app)


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):

    return {
        "success": False,
        "message": "Token has expired."
    }, 401


@jwt.invalid_token_loader
def invalid_token_callback(error):

    return {
        "success": False,
        "message": "Invalid token."
    }, 401


@jwt.unauthorized_loader
def missing_token_callback(error):

    return {
        "success": False,
        "message": "Authorization token is missing."
    }, 401


@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):

    return {
        "success": False,
        "message": "Token has been revoked."
    }, 401