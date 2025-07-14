// Frontend Test Submission/components/RedirectHandler.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Box, Typography, Alert, Button } from '@mui/material'; // <--- ADD Button here
import { getOriginalUrlAndLogClick } from '../api'; // API function
import { log } from '../LoggingMiddleware/logger';
import '../styles/RedirectHandler.css';

function RedirectHandler() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      setLoading(true);
      setError(null);
      try {
        const originalUrl = await getOriginalUrlAndLogClick(shortCode); // This API call also logs the click
        if (originalUrl) {
          log('info', 'RedirectHandler', `Redirecting from ${shortCode} to ${originalUrl}`);
          window.location.replace(originalUrl); // Perform the redirect
        } else {
          setError('Short URL not found or expired.');
          log('warn', 'RedirectHandler', `Short URL not found or expired: ${shortCode}`);
        }
      } catch (err) {
        setError(`Error redirecting: ${err.message}`);
        log('error', 'RedirectHandler', `Error handling redirect for ${shortCode}: ${err.message}`, err.stack);
      } finally {
        setLoading(false);
      }
    };

    if (shortCode) {
      handleRedirect();
    }
  }, [shortCode, navigate]);

  if (loading) {
    return (
      <Box className="redirect-container">
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Redirecting...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="redirect-container">
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>Go to Homepage</Button> {/* Button is now defined */}
      </Box>
    );
  }

  return null; // Component will redirect, so no content needed if successful
}

export default RedirectHandler;