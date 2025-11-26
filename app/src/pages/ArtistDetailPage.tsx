import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EntityList } from '../components/EntityList';
import { artistsApi, albumsApi } from '../services/api';
import { Artist, Album } from '../types';
import { Box, CircularProgress, Typography, Breadcrumbs, Link } from '@mui/material';
import { Home, MusicNote } from '@mui/icons-material';

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [artistData, albumsData] = await Promise.all([
          artistsApi.getById(Number(id)),
          albumsApi.getAll(0, 1000, Number(id)),
        ]);
        setArtist(artistData);
        setAlbums(albumsData);
      } catch (error) {
        console.error('Error fetching artist data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!artist) {
    return (
      <Box p={4}>
        <Typography variant="h4">Artist not found</Typography>
      </Box>
    );
  }

  const columns = [
    { id: 'album_id', label: 'ID', minWidth: 50 },
    { id: 'title', label: 'Album Title', minWidth: 250 },
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
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <MusicNote sx={{ mr: 0.5 }} fontSize="inherit" />
          {artist.name || 'Unknown Artist'}
        </Typography>
      </Breadcrumbs>
      <Typography variant="h4" component="h1" gutterBottom>
        {artist.name || 'Unknown Artist'}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Albums
      </Typography>
      <EntityList
        title=""
        columns={columns}
        data={albums.map(a => ({ ...a, id: a.album_id }))}
        onRowClick={(albumId) => navigate(`/artists/${id}/albums/${albumId}`)}
      />
    </Box>
  );
};

