from app.errors import BaseErrorCode


class UserErrorCode(BaseErrorCode):
    """
    User errors (Category B)
    """
    EMAIL_ALREADY_REGISTERED = ("B0001", "The email address is already registered")
    NAME_ALREADY_REGISTERED = ("B0002", "The username is already registered")
    INVALID_EMAIL_PASSWORD = ("B0003", "Invalid email or password")
    ACCOUNT_NOT_ACTIVE = ("B0004", "Account is not active")
    SIGNUP_EMAIL_VERIFICATION_TOO_FREQUENT = (
        "B0005", 
        "Signup email verification requests are too frequent. Please try again later."
    )
    SIGNUP_EMAIL_VERIFICATION_CODE_EXPIRED = (
        "B0006", 
        "The email verification code has expired. Please request a new one."
    )
    EMAIL_NOT_REGISTERED = (
        "B0007", 
        "The email address is not registered. Please check and try again."
    )
    ACCOUNT_ALREADY_ACTIVE = (
        "B0008", 
        "The account is already active. No further action is required."
    )
    