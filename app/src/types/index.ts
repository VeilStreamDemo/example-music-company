export interface Artist {
  artist_id: number;
  name: string | null;
}

export interface Album {
  album_id: number;
  title: string;
  artist_id: number;
  artist?: Artist | null;
}

export interface Genre {
  genre_id: number;
  name: string | null;
}

export interface MediaType {
  media_type_id: number;
  name: string | null;
}

export interface Track {
  track_id: number;
  name: string;
  album_id: number | null;
  media_type_id: number;
  genre_id: number | null;
  composer: string | null;
  milliseconds: number;
  bytes: number | null;
  unit_price: number;
  album?: Album | null;
  genre?: Genre | null;
  media_type?: MediaType | null;
}

export interface Employee {
  employee_id: number;
  last_name: string;
  first_name: string;
  title: string | null;
  reports_to: number | null;
  birth_date: string | null;
  hire_date: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
}

export interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  company: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  phone: string | null;
  fax: string | null;
  email: string;
  support_rep_id: number | null;
  support_rep?: Employee | null;
}

export interface InvoiceLine {
  invoice_line_id: number;
  invoice_id: number;
  track_id: number;
  unit_price: number;
  quantity: number;
  track?: Track | null;
}

export interface Invoice {
  invoice_id: number;
  customer_id: number;
  invoice_date: string;
  billing_address: string | null;
  billing_city: string | null;
  billing_state: string | null;
  billing_country: string | null;
  billing_postal_code: string | null;
  total: number;
  customer?: Customer | null;
  invoice_lines?: InvoiceLine[];
}

export interface PlaylistTrack {
  playlist_id: number;
  track_id: number;
  track?: Track | null;
}

export interface Playlist {
  playlist_id: number;
  name: string | null;
  tracks?: PlaylistTrack[];
}

