from datetime import timedelta
from unittest.mock import MagicMock

import pytest
from fastapi import Request

from utils.security import (
    create_access_token,
    decode_access_token,
    get_account_id_from_request,
    get_account_id_from_token,
    hash_password,
    verify_password,
)


def test_password_hashing():
    password = "test_password"  # noqa: S105
    hashed = hash_password(password)

    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)


def test_create_and_decode_token():
    test_data = {"aid": "123", "email": "test@example.com"}
    token = create_access_token(data=test_data, expires_delta=timedelta(minutes=15))

    decoded = decode_access_token(token)
    assert decoded["aid"] == test_data["aid"]
    assert decoded["email"] == test_data["email"]


def test_decode_invalid_token():
    with pytest.raises(ValueError):
        decode_access_token("invalid_token")


def test_get_account_id_from_token():
    test_data = {"aid": "123"}
    token = create_access_token(data=test_data)

    account_id = get_account_id_from_token(token)
    assert account_id == "123"


@pytest.fixture
def mock_request():
    test_data = {"aid": "123"}
    token = create_access_token(data=test_data)
    request = MagicMock(spec=Request)
    request.headers = {"Authorization": f"Bearer {token}"}
    return request


def test_get_account_id_from_request(mock_request):
    account_id = get_account_id_from_request(mock_request)
    assert account_id == "123"
