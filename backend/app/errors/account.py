from app.errors.base import BaseErrorCode


class AccountErrorCode(BaseErrorCode):
    """
    User errors (Category B)
    """
    EMAIL_ALREADY_REGISTERED = ("B0001", "The email address is already registered")
    NAME_ALREADY_REGISTERED = ("B0002", "The username is already registered")
    INVALID_EMAIL_PASSWORD = ("B0003", "Invalid email or password")
    ACCOUNT_NOT_ACTIVE = ("B0004", "Account is not active")
    EMAIL_NOT_REGISTERED = (
        "B0005", 
        "The email address is not registered. Please check and try again."
    )
    ACCOUNT_ALREADY_ACTIVE = (
        "B0006", 
        "The account is already active. No further action is required."
    )
    ACCOUNT_NOT_FOUND = (
        "B0007", 
        "The account is not found."
    )
    CANNOT_REMOVE_LAST_OWNER = (
        "B0008", 
        "Cannot remove the last owner."
    )
    USER_NOT_IN_TENANT = (
        "B0009", 
        "The user is not in the tenant."
    )
    TENANT_NOT_FOUND = (
        "B0010", 
        "The tenant is not found."
    )
    USER_ALREADY_IN_TENANT = (
        "B0011", 
        "The user is already in the tenant."
    )