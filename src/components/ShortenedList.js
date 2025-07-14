// src/components/ShortenedList.js
import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Paper, Link as MuiLink } from '@mui/material';
import { getShortenedUrls } from '../api'; // <--- VERIFY THIS PATH CAREFULLY
import { log } from '../LoggingMiddleware/logger'; // <--- VERIFY THIS PATH CAREFULLY
import '../styles/ShortenedList.css';

function ShortenedList() {
  const [shortenedUrls, setShortenedUrls] = useState([]);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        // const data = await getShortenedUrls(); // Still commented out as per previous design
        // setShortenedUrls(data);
        setShortenedUrls([
          { shortCode: 'abc1', originalUrl: 'https://example.com/very/long/url/1', expiresAt: new Date(Date.now() + 30 * 60 * 1000).toLocaleString() },
          { shortCode: 'xyz2', originalUrl: 'https://another.website/path/to/resource', expiresAt: new Date(Date.now() + 60 * 60 * 1000).toLocaleString() },
        ]);
        log('info', 'ShortenedList', 'Fetched mocked shortened URLs.');
      } catch (error) {
        log('error', 'ShortenedList', `Failed to fetch shortened URLs: ${error.message}`, error.stack);
      }
    };
    fetchUrls();
  }, []);

  return (
    <Paper className="shortened-list-container" elevation={3} sx={{ mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Your Shortened URLs
      </Typography>
      {shortenedUrls.length === 0 ? (
        <Typography variant="body1">No URLs shortened yet.</Typography>
      ) : (
        <List>
          {shortenedUrls.map((url, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={
                  <>
                    Short URL: <MuiLink href={`http://localhost:3000/${url.shortCode}`} target="_blank" rel="noopener noreferrer">
                      {`http://localhost:3000/${url.shortCode}`}
                    </MuiLink>
                  </>
                }
                secondary={
                  <>
                    Original URL: {url.originalUrl} <br />
                    Expires: {url.expiresAt}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}

export default ShortenedList;