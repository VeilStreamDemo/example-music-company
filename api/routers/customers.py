from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from database import get_db
from models import Customer, Employee
import database

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.get("", response_model=List[Customer])
async def get_customers(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    customer_table = database.Base.metadata.tables['customer']
    employee_table = database.Base.metadata.tables['employee']
    
    result = await db.execute(
        select(
            customer_table,
            employee_table.c.first_name.label('support_rep_first_name'),
            employee_table.c.last_name.label('support_rep_last_name')
        ).select_from(
            customer_table.outerjoin(
                employee_table,
                customer_table.c.support_rep_id == employee_table.c.employee_id
            )
        ).offset(skip).limit(limit)
    )
    rows = result.fetchall()
    
    customers = []
    for row in rows:
        customer_data = {
            'customer_id': row.customer_id,
            'first_name': row.first_name,
            'last_name': row.last_name,
            'company': row.company,
            'address': row.address,
            'city': row.city,
            'state': row.state,
            'country': row.country,
            'postal_code': row.postal_code,
            'phone': row.phone,
            'fax': row.fax,
            'email': row.email,
            'support_rep_id': row.support_rep_id,
        }
        
        if row.support_rep_id and row.support_rep_first_name:
            customer_data['support_rep'] = Employee(
                employee_id=row.support_rep_id,
                first_name=row.support_rep_first_name,
                last_name=row.support_rep_last_name or ''
            )
        
        customers.append(Customer(**customer_data))
    
    return customers


@router.get("/{customer_id}", response_model=Customer)
async def get_customer(customer_id: int, db: AsyncSession = Depends(get_db)):
    customer_table = database.Base.metadata.tables['customer']
    employee_table = database.Base.metadata.tables['employee']
    
    result = await db.execute(
        select(
            customer_table,
            employee_table.c.first_name.label('support_rep_first_name'),
            employee_table.c.last_name.label('support_rep_last_name')
        ).select_from(
            customer_table.outerjoin(
                employee_table,
                customer_table.c.support_rep_id == employee_table.c.employee_id
            )
        ).where(customer_table.c.customer_id == customer_id)
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    customer_data = {
        'customer_id': row.customer_id,
        'first_name': row.first_name,
        'last_name': row.last_name,
        'company': row.company,
        'address': row.address,
        'city': row.city,
        'state': row.state,
        'country': row.country,
        'postal_code': row.postal_code,
        'phone': row.phone,
        'fax': row.fax,
        'email': row.email,
        'support_rep_id': row.support_rep_id,
    }
    
    if row.support_rep_id and row.support_rep_first_name:
        customer_data['support_rep'] = Employee(
            employee_id=row.support_rep_id,
            first_name=row.support_rep_first_name,
            last_name=row.support_rep_last_name or ''
        )
    
    return Customer(**customer_data)

