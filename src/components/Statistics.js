// src/components/Statistics.js
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link as MuiLink // <--- IMPORT Link and RENAME it to MuiLink here
} from '@mui/material';
import { getUrlStatistics } from '../api'; // <--- VERIFY THIS PATH CAREFULLY
import { log } from '../LoggingMiddleware/logger'; // <--- VERIFY THIS PATH CAREFULLY
import '../styles/Statistics.css';

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const mockStats = {
          totalClicks: 150,
          urlStats: [
            {
              shortCode: 'abc1',
              originalUrl: 'https://example.com/very/long/url/1',
              clicks: [
                { timestamp: new Date(Date.now() - 3600000).toLocaleString(), referrer: 'google.com', geo: 'New York, USA' },
                { timestamp: new Date(Date.now() - 1800000).toLocaleString(), referrer: 'facebook.com', geo: 'London, UK' },
                { timestamp: new Date(Date.now() - 600000).toLocaleString(), referrer: 'direct', geo: 'Bengaluru, India' },
              ],
            },
            {
              shortCode: 'xyz2',
              originalUrl: 'https://another.website/path/to/resource',
              clicks: [
                { timestamp: new Date(Date.now() - 7200000).toLocaleString(), referrer: 'twitter.com', geo: 'Tokyo, Japan' },
                { timestamp: new Date(Date.now() - 300000).toLocaleString(), referrer: 'google.com', geo: 'Berlin, Germany' },
              ],
            },
          ],
        };
        setStats(mockStats);
        log('info', 'Statistics', 'Fetched mocked URL statistics.');
      } catch (err) {
        setError(`Failed to load statistics: ${err.message}`);
        log('error', 'Statistics', `Error fetching statistics: ${err.message}`, err.stack);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box className="stats-container-loading">
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading Statistics...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="stats-container-error">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!stats || stats.urlStats.length === 0) {
    return (
      <Paper className="stats-container" elevation={3}>
        <Typography variant="h5" component="h2" gutterBottom>
          URL Statistics
        </Typography>
        <Typography variant="body1">No statistics available yet.</Typography>
      </Paper>
    );
  }

  return (
    <Paper className="stats-container" elevation={3}>
      <Typography variant="h5" component="h2" gutterBottom>
        URL Statistics
      </Typography>
      <Typography variant="h6" gutterBottom>
        Total Clicks Across All Shortened URLs: {stats.totalClicks}
      </Typography>

      {stats.urlStats.map((urlStat, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Typography variant="h6" component="h3" gutterBottom>
            Short URL: <MuiLink href={`http://localhost:3000/${urlStat.shortCode}`} target="_blank" rel="noopener noreferrer">
              {`http://localhost:3000/${urlStat.shortCode}`}
            </MuiLink>
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Original URL: {urlStat.originalUrl}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Total Clicks for this URL: {urlStat.clicks.length}
          </Typography>
          {urlStat.clicks.length > 0 ? (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Referrer</TableCell>
                    <TableCell>Geo-location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {urlStat.clicks.map((click, clickIndex) => (
                    <TableRow key={clickIndex}>
                      <TableCell>{click.timestamp}</TableCell>
                      <TableCell>{click.referrer}</TableCell>
                      <TableCell>{click.geo}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2">No click data available for this URL.</Typography>
          )}
        </Box>
      ))}
    </Paper>
  );
}

export default Statistics;