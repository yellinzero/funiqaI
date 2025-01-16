from typing import ClassVar, List

from fastapi import Request, status
from fastapi.responses import JSONResponse
from jose import JWTError
from starlette.middleware.base import BaseHTTPMiddleware

from app.errors.base import FuniqAIError
from app.errors.common import CommonErrorCode
from utils.security import decode_access_token, refresh_access_token


class TokenRefreshMiddleware(BaseHTTPMiddleware):
    PUBLIC_PATH_PREFIXES: ClassVar[List[str]] = ["/auth/", "/health"]

    async def dispatch(self, request: Request, call_next):
        print(request.scope)
        try:
            # Skip auth for public endpoints
            if any(request.url.path.startswith(prefix) for prefix in self.PUBLIC_PATH_PREFIXES):
                return await call_next(request)

            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                return self.handle_error(
                    CommonErrorCode.UNAUTHORIZED.exception(status_code=status.HTTP_401_UNAUTHORIZED)
                )

            access_token = auth_header.replace("Bearer ", "")
            refresh_token = request.headers.get("X-Refresh-Token")

            try:
                # Try to decode access token
                decode_access_token(access_token)
                return await call_next(request)
            except (JWTError, ValueError):
                if not refresh_token:
                    return self.handle_error(
                        CommonErrorCode.UNAUTHORIZED.exception(status_code=status.HTTP_401_UNAUTHORIZED)
                    )
                try:
                    # Try to refresh the access token
                    new_access_token = refresh_access_token(refresh_token)
                    headers = request.scope["headers"]
                    headers_dict = dict(headers)
                    headers_dict[b"authorization"] = f"Bearer {new_access_token}".encode()
                    request.scope["headers"] = list(headers_dict.items())
                    response = await call_next(request)
                    response.headers["X-New-Access-Token"] = new_access_token
                    return response
                except JWTError:
                    return self.handle_error(
                        CommonErrorCode.UNAUTHORIZED.exception(status_code=status.HTTP_401_UNAUTHORIZED)
                    )

        except Exception:
            return self.handle_error(CommonErrorCode.UNAUTHORIZED.exception(status_code=status.HTTP_401_UNAUTHORIZED))

    def handle_error(self, exc: FuniqAIError):
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.to_dict(),
        )
