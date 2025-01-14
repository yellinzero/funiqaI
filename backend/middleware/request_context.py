from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request.state.language = request.headers.get("X-LANGUAGE", "en")
        request.state.tenant_id = request.headers.get("X-Tenant-ID")
        
        response = await call_next(request)
        return response 