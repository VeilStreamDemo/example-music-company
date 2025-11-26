import React, { useEffect, useState } from 'react';
import { EntityList } from '../components/EntityList';
import { genresApi } from '../services/api';
import { Genre } from '../types';
import { Box, CircularProgress } from '@mui/material';

export const GenresPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await genresApi.getAll();
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const columns = [
    { id: 'genre_id', label: 'ID', minWidth: 50 },
    { id: 'name', label: 'Name', minWidth: 200 },
  ];

  return (
    <EntityList
      title="Genres"
      columns={columns}
      data={genres.map(g => ({ ...g, id: g.genre_id }))}
    />
  );
};

