import os
from fastapi import APIRouter
from typing import Dict

router = APIRouter(prefix="/api/envvars", tags=["envvars"])


@router.get("")
async def get_envvars() -> Dict[str, str]:
    """
    Get all environment variables from the API pod.
    Masks sensitive values (passwords, keys, tokens).
    """
    env_vars = {}
    sensitive_keys = ['password', 'secret', 'key', 'token', 'api_key', 'auth']
    
    for key, value in os.environ.items():
        # Mask sensitive values
        if any(sensitive in key.lower() for sensitive in sensitive_keys):
            env_vars[key] = "***MASKED***"
        else:
            env_vars[key] = value
    
    return env_vars

