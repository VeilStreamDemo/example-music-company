from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import artists, albums, tracks, customers, invoices, employees, genres, playlists
import database

app = FastAPI(title="Chinook Music API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


@app.on_event("startup")
async def startup():
    # Reflect database tables
    async with database.engine.begin() as conn:
        await conn.run_sync(database.Base.metadata.reflect)


@app.get("/")
async def root():
    return {"message": "Chinook Music API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

