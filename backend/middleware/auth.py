from typing import ClassVar, List

from fastapi import Request, status
from fastapi.responses import JSONResponse
from jose import JWTError
from loguru import logger
from redis import RedisError
from starlette.middleware.base import BaseHTTPMiddleware

from app.errors.base import FuniqAIError
from app.errors.common import CommonErrorCode
from utils.security import (
    decode_access_token,
    get_refresh_token_from_cookie,
    refresh_access_token,
    verify_refresh_token,
)


class TokenRefreshMiddleware(BaseHTTPMiddleware):
    PUBLIC_PATH_PREFIXES: ClassVar[List[str]] = ["/auth/", "/health", "/openapi.json", "/docs", "/redoc"]

    async def dispatch(self, request: Request, call_next):
        try:
            # Skip auth for OPTIONS requests, CORS preflight requests and public endpoints
            if (
                request.method == "OPTIONS"
                or any(request.url.path.startswith(prefix) for prefix in self.PUBLIC_PATH_PREFIXES)
            ):
                logger.debug(f"Skipping auth for public path: {request.url.path}")
                return await call_next(request)

            auth_header = request.headers.get("Authorization")
            refresh_token = get_refresh_token_from_cookie(request)

            if not auth_header or not auth_header.startswith("Bearer ") or not refresh_token:
                logger.warning("Missing or invalid Authorization header or refresh token")
                raise CommonErrorCode.UNAUTHORIZED.exception(status_code=status.HTTP_401_UNAUTHORIZED)

            access_token = auth_header.replace("Bearer ", "")

            # Verify refresh token first
            try:
                verify_refresh_token(refresh_token)
                logger.debug("Refresh token verified successfully")
            except (FuniqAIError, RedisError) as e:
                logger.error(f"Refresh token verification failed: {e!s}")
                raise CommonErrorCode.UNAUTHORIZED.exception(status_code=status.HTTP_401_UNAUTHORIZED) from e

            # Then check access token
            try:
                decode_access_token(access_token)
                logger.debug("Access token verified successfully")
                return await call_next(request)
            except (JWTError, ValueError):
                # Access token invalid but refresh token valid, refresh access token
                logger.info("Access token expired, refreshing with valid refresh token")
                new_access_token = refresh_access_token(refresh_token)
                headers = request.scope["headers"]
                headers_dict = dict(headers)
                headers_dict[b"authorization"] = f"Bearer {new_access_token}".encode()
                request.scope["headers"] = list(headers_dict.items())
                try:
                    response = await call_next(request)
                    response.headers["X-New-Access-Token"] = new_access_token
                    logger.info("Successfully refreshed access token")
                    return response
                except Exception as e:
                    # Let business logic errors propagate
                    logger.error(f"Error occurred after token refresh: {e!s}")
                    raise

        except (FuniqAIError, JWTError, ValueError, RedisError) as e:
            # Only handle authentication-related errors
            logger.error(f"Authentication error: {e!s}")
            if isinstance(e, FuniqAIError):
                return self.handle_error(e)
            return self.handle_error(CommonErrorCode.UNAUTHORIZED.exception(status_code=status.HTTP_401_UNAUTHORIZED))

    def handle_error(self, exc: FuniqAIError):
        logger.error(f"Handling authentication error: {exc!s}")
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.to_dict(),
        )
