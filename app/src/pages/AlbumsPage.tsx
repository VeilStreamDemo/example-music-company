import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { albumsApi } from '../services/api';
import { Album } from '../types';
import { Box, CircularProgress } from '@mui/material';

export const AlbumsPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await albumsApi.getAll();
        setAlbums(data);
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const columns = [
    { id: 'album_id', label: 'ID', minWidth: 50 },
    { id: 'title', label: 'Title', minWidth: 200 },
    { id: 'artist_name', label: 'Artist', minWidth: 150 },
  ];

  return (
    <EntityList
      title="Albums"
      columns={columns}
      data={albums.map(a => ({ ...a, id: a.album_id, artist_name: a.artist?.name || '-' }))}
      onRowClick={(id) => navigate(`/albums/${id}`)}
    />
  );
};

