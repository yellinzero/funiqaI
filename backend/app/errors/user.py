from app.errors import BaseErrorCode


class UserErrorCode(BaseErrorCode):
    """
    User errors (Category B)
    """
    EMAIL_ALREADY_REGISTERED = ("B0001", "The email address is already registered")
    NAME_ALREADY_REGISTERED = ("B0002", "The username is already registered")
    INVALID_EMAIL_PASSWORD = ("B0003", "Invalid email or password")
    ACCOUNT_NOT_ACTIVE = ("B0004", "Account is not active")