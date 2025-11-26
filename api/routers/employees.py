from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Employee
import database

router = APIRouter(prefix="/api/employees", tags=["employees"])


@router.get("", response_model=List[Employee])
async def get_employees(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(database.Base.metadata.tables['employee']).offset(skip).limit(limit)
    )
    rows = result.fetchall()
    return [
        Employee(
            employee_id=row.employee_id,
            last_name=row.last_name,
            first_name=row.first_name,
            title=row.title,
            reports_to=row.reports_to,
            birth_date=row.birth_date,
            hire_date=row.hire_date,
            address=row.address,
            city=row.city,
            state=row.state,
            country=row.country,
            postal_code=row.postal_code,
            phone=row.phone,
            fax=row.fax,
            email=row.email
        )
        for row in rows
    ]

