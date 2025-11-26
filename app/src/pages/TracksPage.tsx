import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { tracksApi } from '../services/api';
import { Track } from '../types';
import { Box, CircularProgress } from '@mui/material';

export const TracksPage: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const data = await tracksApi.getAll();
        setTracks(data);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
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
    { id: 'name', label: 'Name', minWidth: 250 },
    { id: 'album_title', label: 'Album', minWidth: 150 },
    { id: 'artist_name', label: 'Artist', minWidth: 150 },
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
    <EntityList
      title="Tracks"
      columns={columns}
      data={tracks.map(t => ({
        ...t,
        id: t.track_id,
        album_title: t.album?.title || '-',
        artist_name: t.album?.artist?.name || '-',
        genre_name: t.genre?.name || '-',
      }))}
      onRowClick={(id) => navigate(`/tracks/${id}`)}
    />
  );
};

