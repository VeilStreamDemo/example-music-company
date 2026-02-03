import axios from 'axios';
import {
  Artist,
  Album,
  Track,
  Customer,
  Invoice,
  Employee,
  Genre,
  Playlist,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const artistsApi = {
  getAll: async (skip = 0, limit = 100): Promise<Artist[]> => {
    const response = await api.get('/api/artists', { params: { skip, limit } });
    return response.data;
  },
  getById: async (id: number): Promise<Artist> => {
    const response = await api.get(`/api/artists/${id}`);
    return response.data;
  },
};

export const albumsApi = {
  getAll: async (skip = 0, limit = 100, artistId?: number): Promise<Album[]> => {
    const params: any = { skip, limit };
    if (artistId) params.artist_id = artistId;
    const response = await api.get('/api/albums', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Album> => {
    const response = await api.get(`/api/albums/${id}`);
    return response.data;
  },
};

export const tracksApi = {
  getAll: async (skip = 0, limit = 100, albumId?: number, artistId?: number): Promise<Track[]> => {
    const params: any = { skip, limit };
    if (albumId) params.album_id = albumId;
    if (artistId) params.artist_id = artistId;
    const response = await api.get('/api/tracks', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Track> => {
    const response = await api.get(`/api/tracks/${id}`);
    return response.data;
  },
};

export const customersApi = {
  getAll: async (skip = 0, limit = 100): Promise<Customer[]> => {
    const response = await api.get('/api/customers', { params: { skip, limit } });
    return response.data;
  },
  getById: async (id: number): Promise<Customer> => {
    const response = await api.get(`/api/customers/${id}`);
    return response.data;
  },
};

export const invoicesApi = {
  getAll: async (skip = 0, limit = 100, customerId?: number): Promise<Invoice[]> => {
    const params: any = { skip, limit };
    if (customerId) params.customer_id = customerId;
    const response = await api.get('/api/invoices', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Invoice> => {
    const response = await api.get(`/api/invoices/${id}`);
    return response.data;
  },
};

export const employeesApi = {
  getAll: async (skip = 0, limit = 100): Promise<Employee[]> => {
    const response = await api.get('/api/employees', { params: { skip, limit } });
    return response.data;
  },
};

export const genresApi = {
  getAll: async (skip = 0, limit = 100): Promise<Genre[]> => {
    const response = await api.get('/api/genres', { params: { skip, limit } });
    return response.data;
  },
};

export const playlistsApi = {
  getAll: async (skip = 0, limit = 100): Promise<Playlist[]> => {
    const response = await api.get('/api/playlists', { params: { skip, limit } });
    return response.data;
  },
  getById: async (id: number): Promise<Playlist> => {
    const response = await api.get(`/api/playlists/${id}`);
    return response.data;
  },
};

export const envvarsApi = {
  getAll: async (): Promise<Record<string, string>> => {
    const response = await api.get('/api/envvars');
    return response.data;
  },
};

