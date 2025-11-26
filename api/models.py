from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class Artist(BaseModel):
    artist_id: int
    name: Optional[str] = None

    class Config:
        from_attributes = True


class Album(BaseModel):
    album_id: int
    title: str
    artist_id: int
    artist: Optional[Artist] = None

    class Config:
        from_attributes = True


class Genre(BaseModel):
    genre_id: int
    name: Optional[str] = None

    class Config:
        from_attributes = True


class MediaType(BaseModel):
    media_type_id: int
    name: Optional[str] = None

    class Config:
        from_attributes = True


class Track(BaseModel):
    track_id: int
    name: str
    album_id: Optional[int] = None
    media_type_id: int
    genre_id: Optional[int] = None
    composer: Optional[str] = None
    milliseconds: int
    bytes: Optional[int] = None
    unit_price: Decimal
    album: Optional[Album] = None
    genre: Optional[Genre] = None
    media_type: Optional[MediaType] = None

    class Config:
        from_attributes = True


class Employee(BaseModel):
    employee_id: int
    last_name: str
    first_name: str
    title: Optional[str] = None
    reports_to: Optional[int] = None
    birth_date: Optional[datetime] = None
    hire_date: Optional[datetime] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    fax: Optional[str] = None
    email: Optional[str] = None

    class Config:
        from_attributes = True


class Customer(BaseModel):
    customer_id: int
    first_name: str
    last_name: str
    company: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    fax: Optional[str] = None
    email: str
    support_rep_id: Optional[int] = None
    support_rep: Optional[Employee] = None

    class Config:
        from_attributes = True


class InvoiceLine(BaseModel):
    invoice_line_id: int
    invoice_id: int
    track_id: int
    unit_price: Decimal
    quantity: int
    track: Optional[Track] = None

    class Config:
        from_attributes = True


class Invoice(BaseModel):
    invoice_id: int
    customer_id: int
    invoice_date: datetime
    billing_address: Optional[str] = None
    billing_city: Optional[str] = None
    billing_state: Optional[str] = None
    billing_country: Optional[str] = None
    billing_postal_code: Optional[str] = None
    total: Decimal
    customer: Optional[Customer] = None
    invoice_lines: Optional[List[InvoiceLine]] = []

    class Config:
        from_attributes = True


class PlaylistTrack(BaseModel):
    playlist_id: int
    track_id: int
    track: Optional[Track] = None

    class Config:
        from_attributes = True


class Playlist(BaseModel):
    playlist_id: int
    name: Optional[str] = None
    tracks: Optional[List[PlaylistTrack]] = []

    class Config:
        from_attributes = True

