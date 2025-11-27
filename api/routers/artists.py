from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Artist
import database

router = APIRouter(prefix="/api/artists", tags=["artists"])


@router.get("", response_model=List[Artist])
async def get_artists(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    # Try to reflect tables if not already reflected
    if 'artist' not in database.Base.metadata.tables:
        try:
            async with database.engine.begin() as conn:
                await conn.run_sync(database.Base.metadata.reflect)
        except Exception as e:
            raise HTTPException(
                status_code=503,
                detail=f"Database not initialized. Tables not found. Error: {str(e)}. Please ensure database initialization scripts have run."
            )
    
    if 'artist' not in database.Base.metadata.tables:
        raise HTTPException(
            status_code=503,
            detail="Database not initialized. 'artist' table not found. Please ensure database initialization scripts have run."
        )
    
    result = await db.execute(select(database.Base.metadata.tables['artist']).offset(skip).limit(limit))
    rows = result.fetchall()
    return [Artist(artist_id=row.artist_id, name=row.name) for row in rows]


@router.get("/{artist_id}", response_model=Artist)
async def get_artist(artist_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(database.Base.metadata.tables['artist']).where(
            database.Base.metadata.tables['artist'].c.artist_id == artist_id
        )
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Artist not found")
    return Artist(artist_id=row.artist_id, name=row.name)

