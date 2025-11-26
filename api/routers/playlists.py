from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Playlist, PlaylistTrack, Track
import database

router = APIRouter(prefix="/api/playlists", tags=["playlists"])


@router.get("", response_model=List[Playlist])
async def get_playlists(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(database.Base.metadata.tables['playlist']).offset(skip).limit(limit)
    )
    rows = result.fetchall()
    return [Playlist(playlist_id=row.playlist_id, name=row.name) for row in rows]


@router.get("/{playlist_id}", response_model=Playlist)
async def get_playlist(playlist_id: int, db: AsyncSession = Depends(get_db)):
    playlist_table = database.Base.metadata.tables['playlist']
    playlist_track_table = database.Base.metadata.tables['playlist_track']
    track_table = database.Base.metadata.tables['track']
    
    # Get playlist
    result = await db.execute(
        select(playlist_table).where(playlist_table.c.playlist_id == playlist_id)
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Playlist not found")
    
    # Get tracks
    tracks_result = await db.execute(
        select(
            playlist_track_table.c.playlist_id,
            playlist_track_table.c.track_id,
            track_table.c.name.label('track_name'),
            track_table.c.milliseconds,
            track_table.c.unit_price
        ).select_from(
            playlist_track_table.join(track_table, playlist_track_table.c.track_id == track_table.c.track_id)
        ).where(playlist_track_table.c.playlist_id == playlist_id)
    )
    tracks_rows = tracks_result.fetchall()
    
    playlist_tracks = []
    for track_row in tracks_rows:
        playlist_tracks.append(PlaylistTrack(
            playlist_id=track_row.playlist_id,
            track_id=track_row.track_id,
            track=Track(
                track_id=track_row.track_id,
                name=track_row.track_name,
                milliseconds=track_row.milliseconds,
                unit_price=track_row.unit_price
            ) if track_row.track_name else None
        ))
    
    return Playlist(
        playlist_id=row.playlist_id,
        name=row.name,
        tracks=playlist_tracks
    )

