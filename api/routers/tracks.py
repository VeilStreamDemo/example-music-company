from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from database import get_db
from models import Track, Album, Artist, Genre, MediaType
import database

router = APIRouter(prefix="/api/tracks", tags=["tracks"])


@router.get("", response_model=List[Track])
async def get_tracks(
    skip: int = 0,
    limit: int = 100,
    album_id: Optional[int] = Query(None),
    artist_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    track_table = database.Base.metadata.tables['track']
    album_table = database.Base.metadata.tables['album']
    artist_table = database.Base.metadata.tables['artist']
    genre_table = database.Base.metadata.tables['genre']
    media_type_table = database.Base.metadata.tables['media_type']
    
    query = select(
        track_table,
        album_table.c.title.label('album_title'),
        artist_table.c.artist_id.label('artist_id'),
        artist_table.c.name.label('artist_name'),
        genre_table.c.name.label('genre_name'),
        media_type_table.c.name.label('media_type_name')
    ).select_from(
        track_table
        .outerjoin(album_table, track_table.c.album_id == album_table.c.album_id)
        .outerjoin(artist_table, album_table.c.artist_id == artist_table.c.artist_id)
        .outerjoin(genre_table, track_table.c.genre_id == genre_table.c.genre_id)
        .outerjoin(media_type_table, track_table.c.media_type_id == media_type_table.c.media_type_id)
    )
    
    if album_id:
        query = query.where(track_table.c.album_id == album_id)
    elif artist_id:
        query = query.where(artist_table.c.artist_id == artist_id)
    
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    rows = result.fetchall()
    
    tracks = []
    for row in rows:
        track_data = {
            'track_id': row.track_id,
            'name': row.name,
            'album_id': row.album_id,
            'media_type_id': row.media_type_id,
            'genre_id': row.genre_id,
            'composer': row.composer,
            'milliseconds': row.milliseconds,
            'bytes': row.bytes,
            'unit_price': row.unit_price,
        }
        
        if row.album_id and row.album_title:
            track_data['album'] = Album(
                album_id=row.album_id,
                title=row.album_title,
                artist_id=row.artist_id if row.artist_id else 0
            )
        
        if row.genre_id and row.genre_name:
            track_data['genre'] = Genre(genre_id=row.genre_id, name=row.genre_name)
        
        if row.media_type_id and row.media_type_name:
            track_data['media_type'] = MediaType(media_type_id=row.media_type_id, name=row.media_type_name)
        
        tracks.append(Track(**track_data))
    
    return tracks


@router.get("/{track_id}", response_model=Track)
async def get_track(track_id: int, db: AsyncSession = Depends(get_db)):
    track_table = database.Base.metadata.tables['track']
    album_table = database.Base.metadata.tables['album']
    artist_table = database.Base.metadata.tables['artist']
    genre_table = database.Base.metadata.tables['genre']
    media_type_table = database.Base.metadata.tables['media_type']
    
    result = await db.execute(
        select(
            track_table,
            album_table.c.title.label('album_title'),
            artist_table.c.artist_id.label('artist_id'),
            artist_table.c.name.label('artist_name'),
            genre_table.c.name.label('genre_name'),
            media_type_table.c.name.label('media_type_name')
        ).select_from(
            track_table
            .outerjoin(album_table, track_table.c.album_id == album_table.c.album_id)
            .outerjoin(artist_table, album_table.c.artist_id == artist_table.c.artist_id)
            .outerjoin(genre_table, track_table.c.genre_id == genre_table.c.genre_id)
            .outerjoin(media_type_table, track_table.c.media_type_id == media_type_table.c.media_type_id)
        ).where(track_table.c.track_id == track_id)
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Track not found")
    
    track_data = {
        'track_id': row.track_id,
        'name': row.name,
        'album_id': row.album_id,
        'media_type_id': row.media_type_id,
        'genre_id': row.genre_id,
        'composer': row.composer,
        'milliseconds': row.milliseconds,
        'bytes': row.bytes,
        'unit_price': row.unit_price,
    }
    
    if row.album_id and row.album_title:
        track_data['album'] = Album(
            album_id=row.album_id,
            title=row.album_title,
            artist_id=row.artist_id if row.artist_id else 0
        )
    
    if row.genre_id and row.genre_name:
        track_data['genre'] = Genre(genre_id=row.genre_id, name=row.genre_name)
    
    if row.media_type_id and row.media_type_name:
        track_data['media_type'] = MediaType(media_type_id=row.media_type_id, name=row.media_type_name)
    
    return Track(**track_data)

