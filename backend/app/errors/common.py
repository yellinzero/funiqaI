from app.errors.base import BaseErrorCode


class CommonErrorCode(BaseErrorCode):
    """
    Common errors (Category A)
    """
    UNAUTHORIZED = ("A0001", "Unauthorized")
    PERMISSION_DENIED = ("A0002", "Permission Denied")
    NOT_FOUND = ("A0003", "Resource Not Found")
    INVALID_ARGUMENT = ("A0004", "Invalid Argument")
    INTERNAL_SERVER_ERROR = ("A0005", "Internal Server Error")
    INVALID_VERIFICATION_CODE = ("A0006", "Invalid verification code")