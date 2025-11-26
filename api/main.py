import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import artists, albums, tracks, customers, invoices, employees, genres, playlists, envvars
import database

app = FastAPI(title="Chinook Music API", version="1.0.0")

# Configure CORS
# Note: allow_origins=["*"] cannot be used with allow_credentials=True
# So we either use wildcard without credentials, or specific origins with credentials
import os
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
if cors_origins == ["*"]:
    # Wildcard origin - cannot use credentials
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Specific origins - can use credentials
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
app.include_router(artists.router)
app.include_router(albums.router)
app.include_router(tracks.router)
app.include_router(customers.router)
app.include_router(invoices.router)
app.include_router(employees.router)
app.include_router(genres.router)
app.include_router(playlists.router)
app.include_router(envvars.router)


async def wait_for_database(max_retries=None, delay=None):
    """Wait for database to be ready with retry logic"""
    import os
    max_retries = max_retries or int(os.getenv("DB_MAX_RETRIES", "30"))
    delay = delay or float(os.getenv("DB_RETRY_DELAY", "2.0"))
    
    for attempt in range(max_retries):
        try:
            async with database.engine.begin() as conn:
                await conn.run_sync(database.Base.metadata.reflect)
            print("Database connection successful!")
            return
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"Database not ready yet (attempt {attempt + 1}/{max_retries}): {e}")
                await asyncio.sleep(delay)
            else:
                print(f"Failed to connect to database after {max_retries} attempts: {e}")
                raise


@app.on_event("startup")
async def startup():
    # Wait for database to be ready and reflect tables
    await wait_for_database()


@app.get("/")
async def root():
    return {"message": "Chinook Music API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

