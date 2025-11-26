from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from database import get_db
from models import Invoice, InvoiceLine, Customer, Track
import database

router = APIRouter(prefix="/api/invoices", tags=["invoices"])


@router.get("", response_model=List[Invoice])
async def get_invoices(
    skip: int = 0,
    limit: int = 100,
    customer_id: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    invoice_table = database.Base.metadata.tables['invoice']
    customer_table = database.Base.metadata.tables['customer']
    
    query = select(
        invoice_table,
        customer_table.c.first_name.label('customer_first_name'),
        customer_table.c.last_name.label('customer_last_name'),
        customer_table.c.email.label('customer_email')
    ).select_from(
        invoice_table.join(customer_table, invoice_table.c.customer_id == customer_table.c.customer_id)
    )
    
    if customer_id:
        query = query.where(invoice_table.c.customer_id == customer_id)
    
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    rows = result.fetchall()
    
    invoices = []
    for row in rows:
        invoice_data = {
            'invoice_id': row.invoice_id,
            'customer_id': row.customer_id,
            'invoice_date': row.invoice_date,
            'billing_address': row.billing_address,
            'billing_city': row.billing_city,
            'billing_state': row.billing_state,
            'billing_country': row.billing_country,
            'billing_postal_code': row.billing_postal_code,
            'total': row.total,
            'customer': Customer(
                customer_id=row.customer_id,
                first_name=row.customer_first_name,
                last_name=row.customer_last_name,
                email=row.customer_email or ''
            ) if row.customer_first_name else None,
            'invoice_lines': []
        }
        invoices.append(Invoice(**invoice_data))
    
    return invoices


@router.get("/{invoice_id}", response_model=Invoice)
async def get_invoice(invoice_id: int, db: AsyncSession = Depends(get_db)):
    invoice_table = database.Base.metadata.tables['invoice']
    customer_table = database.Base.metadata.tables['customer']
    invoice_line_table = database.Base.metadata.tables['invoice_line']
    track_table = database.Base.metadata.tables['track']
    
    # Get invoice with customer
    result = await db.execute(
        select(
            invoice_table,
            customer_table.c.first_name.label('customer_first_name'),
            customer_table.c.last_name.label('customer_last_name'),
            customer_table.c.email.label('customer_email')
        ).select_from(
            invoice_table.join(customer_table, invoice_table.c.customer_id == customer_table.c.customer_id)
        ).where(invoice_table.c.invoice_id == invoice_id)
    )
    row = result.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Get invoice lines
    lines_result = await db.execute(
        select(
            invoice_line_table,
            track_table.c.name.label('track_name')
        ).select_from(
            invoice_line_table.join(track_table, invoice_line_table.c.track_id == track_table.c.track_id)
        ).where(invoice_line_table.c.invoice_id == invoice_id)
    )
    lines_rows = lines_result.fetchall()
    
    invoice_lines = []
    for line_row in lines_rows:
        invoice_lines.append(InvoiceLine(
            invoice_line_id=line_row.invoice_line_id,
            invoice_id=line_row.invoice_id,
            track_id=line_row.track_id,
            unit_price=line_row.unit_price,
            quantity=line_row.quantity,
            track=Track(
                track_id=line_row.track_id,
                name=line_row.track_name,
                milliseconds=0,
                unit_price=line_row.unit_price
            ) if line_row.track_name else None
        ))
    
    invoice_data = {
        'invoice_id': row.invoice_id,
        'customer_id': row.customer_id,
        'invoice_date': row.invoice_date,
        'billing_address': row.billing_address,
        'billing_city': row.billing_city,
        'billing_state': row.billing_state,
        'billing_country': row.billing_country,
        'billing_postal_code': row.billing_postal_code,
        'total': row.total,
        'customer': Customer(
            customer_id=row.customer_id,
            first_name=row.customer_first_name,
            last_name=row.customer_last_name,
            email=row.customer_email or ''
        ) if row.customer_first_name else None,
        'invoice_lines': invoice_lines
    }
    
    return Invoice(**invoice_data)

