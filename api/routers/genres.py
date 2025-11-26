from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Genre
import database

router = APIRouter(prefix="/api/genres", tags=["genres"])


@router.get("", response_model=List[Genre])
async def get_genres(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(database.Base.metadata.tables['genre']).offset(skip).limit(limit)
    )
    rows = result.fetchall()
    return [Genre(genre_id=row.genre_id, name=row.name) for row in rows]

