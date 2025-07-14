// src/components/ShortenerForm.js
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { shortenUrl } from '../api'; // <--- VERIFY THIS PATH CAREFULLY
import { log } from '../LoggingMiddleware/logger'; // <--- VERIFY THIS PATH CAREFULLY
import '../styles/ShortenerForm.css';

function ShortenerForm() {
  const [urls, setUrls] = useState(['']);
  const [customCodes, setCustomCodes] = useState(['']);
  const [expirationTimes, setExpirationTimes] = useState(['30']); // Default 30 mins
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleCustomCodeChange = (index, value) => {
    const newCustomCodes = [...customCodes];
    newCustomCodes[index] = value;
    setCustomCodes(newCustomCodes);
  };

  const handleExpirationChange = (index, value) => {
    const newExpirationTimes = [...expirationTimes];
    newExpirationTimes[index] = value;
    setExpirationTimes(newExpirationTimes);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, '']);
      setCustomCodes([...customCodes, '']);
      setExpirationTimes([...expirationTimes, '30']);
    } else {
      setSnackbar({
        open: true,
        message: 'You can only shorten up to 5 URLs at once.',
        severity: 'warning',
      });
      log('warn', 'ShortenerForm', 'Attempted to add more than 5 URL fields.');
    }
  };

  const removeUrlField = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    const newCustomCodes = customCodes.filter((_, i) => i !== index);
    const newExpirationTimes = expirationTimes.filter((_, i) => i !== index);
    setUrls(newUrls);
    setCustomCodes(newCustomCodes);
    setExpirationTimes(newExpirationTimes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const requests = urls.map((url, index) => {
      if (!url.trim()) return null; // Skip empty URL fields

      const payload = {
        originalUrl: url,
        customCode: customCodes[index] || undefined, // Send if provided
        expirationMinutes: parseInt(expirationTimes[index], 10),
      };
      return payload;
    }).filter(Boolean); // Filter out nulls

    if (requests.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please enter at least one URL.',
        severity: 'warning',
      });
      setLoading(false);
      log('warn', 'ShortenerForm', 'Form submission attempted with no URLs.');
      return;
    }

    try {
      const results = [];
      for (const req of requests) {
        const response = await shortenUrl(req.originalUrl, req.customCode, req.expirationMinutes);
        results.push(response);
      }

      setSnackbar({
        open: true,
        message: 'URLs shortened successfully!',
        severity: 'success',
      });
      log('info', 'ShortenerForm', `Successfully shortened ${results.length} URLs.`);
      setUrls(['']);
      setCustomCodes(['']);
      setExpirationTimes(['30']);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error shortening URLs: ${error.message}`,
        severity: 'error',
      });
      log('error', 'ShortenerForm', `Error shortening URLs: ${error.message}`, error.stack);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper className="shortener-form-container" elevation={3}>
      <Typography variant="h5" component="h2" gutterBottom>
        Shorten Your URLs
      </Typography>
      <form onSubmit={handleSubmit}>
        {urls.map((url, index) => (
          <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label={`Original URL ${index + 1}`}
              variant="outlined"
              fullWidth
              value={url}
              onChange={(e) => handleUrlChange(index, e.target.value)}
              required
            />
            <TextField
              label="Custom Shortcode (Optional)"
              variant="outlined"
              value={customCodes[index]}
              onChange={(e) => handleCustomCodeChange(index, e.target.value)}
              sx={{ width: '200px' }}
            />
            <TextField
              select
              label="Expiration"
              value={expirationTimes[index]}
              onChange={(e) => handleExpirationChange(index, e.target.value)}
              sx={{ width: '150px' }}
            >
              <MenuItem value="30">30 Mins</MenuItem>
              <MenuItem value="60">1 Hour</MenuItem>
              <MenuItem value="1440">1 Day</MenuItem>
              <MenuItem value="10080">1 Week</MenuItem>
              <MenuItem value="43200">1 Month</MenuItem>
              <MenuItem value="0">Never (API dependent)</MenuItem>
            </TextField>
            {urls.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeUrlField(index)}
              >
                Remove
              </Button>
            )}
          </Box>
        ))}
        {urls.length < 5 && (
          <Button variant="outlined" onClick={addUrlField} sx={{ mb: 2 }}>
            Add Another URL
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Shortening...' : 'Shorten URL(s)'}
        </Button>
      </form>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default ShortenerForm;