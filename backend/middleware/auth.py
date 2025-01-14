from fastapi import Request, status
from jose import JWTError
from starlette.middleware.base import BaseHTTPMiddleware

from app.errors.common import CommonErrorCode
from utils.security import decode_access_token, refresh_access_token


class TokenRefreshMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip auth for public endpoints
        route = request.scope.get("route")
        if route and "Public" in getattr(route, "tags", []):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise CommonErrorCode.UNAUTHORIZED.exception(status_code=status.HTTP_401_UNAUTHORIZED)

        access_token = auth_header.replace("Bearer ", "")
        refresh_token = request.headers.get("X-Refresh-Token")

        try:
            # Try to decode access token
            decode_access_token(access_token)
            return await call_next(request)
        except (JWTError, ValueError) as e:
            if not refresh_token:
                raise CommonErrorCode.UNAUTHORIZED.exception(status_code=status.HTTP_401_UNAUTHORIZED) from e

            try:
                # Try to refresh the access token
                new_access_token = await refresh_access_token(refresh_token)
                response = await call_next(request)
                
                # Add new access token to response headers
                response.headers["X-New-Access-Token"] = new_access_token
                return response
            except Exception as e:
                raise CommonErrorCode.UNAUTHORIZED.exception(status_code=status.HTTP_401_UNAUTHORIZED) from e
