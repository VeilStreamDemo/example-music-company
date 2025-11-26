import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import { envvarsApi } from '../services/api';

export const EnvVarsPage: React.FC = () => {
  const [apiEnvVars, setApiEnvVars] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnvVars = async () => {
      try {
        const data = await envvarsApi.getAll();
        setApiEnvVars(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch environment variables');
      } finally {
        setLoading(false);
      }
    };
    fetchEnvVars();
  }, []);

  // Get frontend environment variables (build-time)
  const frontendEnvVars: Record<string, string> = {};
  // React env vars are available via process.env, but only those prefixed with REACT_APP_
  // We'll show what's actually available
  frontendEnvVars['REACT_APP_API_URL'] = process.env.REACT_APP_API_URL || '(not set)';
  
  // Try to get all process.env keys that start with REACT_APP_
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('REACT_APP_')) {
      frontendEnvVars[key] = process.env[key] || '(not set)';
    }
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const renderEnvVarTable = (envVars: Record<string, string>, title: string) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Variable Name</strong></TableCell>
              <TableCell><strong>Value</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(envVars).length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Typography color="text.secondary">No environment variables found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              Object.entries(envVars)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell>
                      <code>{key}</code>
                      {key === 'REACT_APP_API_URL' && (
                        <Chip
                          label="Important"
                          color="primary"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <code style={{ wordBreak: 'break-all' }}>{value}</code>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Environment Variables
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This page shows environment variables from both the frontend (build-time) and API (runtime) pods.
        Note: React environment variables must be set at <strong>build time</strong> and are baked into the JavaScript bundle.
      </Typography>

      {error && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error">Error fetching API environment variables: {error}</Typography>
        </Box>
      )}

      {renderEnvVarTable(frontendEnvVars, 'Frontend Environment Variables (Build-time)')}

      {apiEnvVars && renderEnvVarTable(apiEnvVars, 'API Environment Variables (Runtime)')}
    </Box>
  );
};

