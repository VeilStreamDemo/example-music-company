import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { artistsApi } from '../services/api';
import { Artist } from '../types';
import { Box, CircularProgress } from '@mui/material';

export const ArtistsPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const data = await artistsApi.getAll();
        setArtists(data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const columns = [
    { id: 'artist_id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 200 },
  ];

  return (
    <EntityList
      title="Artists"
      columns={columns}
      data={artists.map(a => ({ ...a, id: a.artist_id }))}
      onRowClick={(id) => navigate(`/artists/${id}`)}
    />
  );
};

