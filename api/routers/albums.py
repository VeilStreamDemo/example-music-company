from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from database import get_db
from models import Album, Artist
import database

router = APIRouter(prefix="/api/albums", tags=["albums"])


@router.get("", response_model=List[Album])
async def get_albums(
    skip: int = 0,
    limit: int = 100,
    artist_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    artist_table = database.Base.metadata.tables['artist']
    album_table = database.Base.metadata.tables['album']
    
    query = select(
        album_table.c.album_id,
        album_table.c.title,
        album_table.c.artist_id,
        artist_table.c.name.label('artist_name')
    ).select_from(
        album_table.join(artist_table, album_table.c.artist_id == artist_table.c.artist_id)
    )
    
    if artist_id:
        query = query.where(album_table.c.artist_id == artist_id)
    
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    rows = result.fetchall()
    
    return [
        Album(
            album_id=row.album_id,
            title=row.title,
            artist_id=row.artist_id,
            artist=Artist(artist_id=row.artist_id, name=row.artist_name) if row.artist_name else None
        )
        for row in rows
    ]


@router.get("/{album_id}", response_model=Album)
async def get_album(album_id: int, db: AsyncSession = Depends(get_db)):
    artist_table = database.Base.metadata.tables['artist']
    album_table = database.Base.metadata.tables['album']
    
    result = await db.execute(
        select(
            album_table.c.album_id,
            album_table.c.title,
            album_table.c.artist_id,
            artist_table.c.name.label('artist_name')
        ).select_from(
            album_table.join(artist_table, album_table.c.artist_id == artist_table.c.artist_id)
        ).where(album_table.c.album_id == album_id)
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Album not found")
    
    return Album(
        album_id=row.album_id,
        title=row.title,
        artist_id=row.artist_id,
        artist=Artist(artist_id=row.artist_id, name=row.artist_name) if row.artist_name else None
    )

