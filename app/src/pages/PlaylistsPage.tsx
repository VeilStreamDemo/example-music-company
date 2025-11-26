import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { playlistsApi } from '../services/api';
import { Playlist } from '../types';
import { Box, CircularProgress } from '@mui/material';

export const PlaylistsPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const data = await playlistsApi.getAll();
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const columns = [
    { id: 'playlist_id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 200 },
    {
      id: 'track_count',
      label: 'Tracks',
      minWidth: 80,
      align: 'right' as const,
    },
  ];

  return (
    <EntityList
      title="Playlists"
      columns={columns}
      data={playlists.map(p => ({
        ...p,
        id: p.playlist_id,
        track_count: p.tracks?.length || 0,
      }))}
      onRowClick={(id) => navigate(`/playlists/${id}`)}
    />
  );
};

