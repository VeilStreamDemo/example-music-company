import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { albumsApi, tracksApi } from '../services/api';
import { Album, Track } from '../types';
import { Box, CircularProgress, Typography, Breadcrumbs, Link } from '@mui/material';
import { Home, MusicNote, Album as AlbumIcon } from '@mui/icons-material';

export const AlbumDetailPage: React.FC = () => {
  const { id, albumId } = useParams<{ id: string; albumId: string }>();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!albumId) return;
      try {
        const [albumData, tracksData] = await Promise.all([
          albumsApi.getById(Number(albumId)),
          tracksApi.getAll(0, 1000, Number(albumId)),
        ]);
        setAlbum(albumData);
        setTracks(tracksData);
      } catch (error) {
        console.error('Error fetching album data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [albumId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!album) {
    return (
      <Box p={4}>
        <Typography variant="h4">Album not found</Typography>
      </Box>
    );
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const columns = [
    { id: 'track_id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Track Name', minWidth: 250 },
    { id: 'genre_name', label: 'Genre', minWidth: 100 },
    {
      id: 'milliseconds',
      label: 'Duration',
      minWidth: 80,
      format: (value: number) => formatDuration(value),
    },
    {
      id: 'unit_price',
      label: 'Price',
      minWidth: 80,
      format: (value: number | string) => `$${Number(value).toFixed(2)}`,
    },
  ];

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate('/artists');
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Artists
        </Link>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/artists/${id}`);
          }}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <MusicNote sx={{ mr: 0.5 }} fontSize="inherit" />
          {album.artist?.name || 'Unknown Artist'}
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <AlbumIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {album.title}
        </Typography>
      </Breadcrumbs>
      <Typography variant="h4" component="h1" gutterBottom>
        {album.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        {album.artist?.name && `by ${album.artist.name}`}
      </Typography>
      <EntityList
        title="Tracks"
        columns={columns}
        data={tracks.map(t => ({
          ...t,
          id: t.track_id,
          genre_name: t.genre?.name || '-',
        }))}
      />
    </Box>
  );
};

