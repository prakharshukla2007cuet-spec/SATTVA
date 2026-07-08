from .auth_middleware import login_required
from .role_required import (
    admin_required,
    teacher_required,
    student_required
)
from .jwt_handler import init_jwt