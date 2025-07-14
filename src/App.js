// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import ShortenerForm from './components/ShortenerForm';
import ShortenedList from './components/ShortenedList';
import Statistics from './components/Statistics';
import RedirectHandler from './components/RedirectHandler';
import './styles/App.css';
import { log } from './LoggingMiddleware/logger'; // <--- VERIFY THIS PATH CAREFULLY

function App() {
  React.useEffect(() => {
    log('info', 'App', 'Application started successfully.');
  }, []);

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Affordmed URL Shortener
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Shorten URLs
          </Button>
          <Button color="inherit" component={Link} to="/statistics">
            Statistics
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<ShortenerForm />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/:shortCode" element={<RedirectHandler />} />
        </Routes>
        <ShortenedList />
      </Container>
    </div>
  );
}

export default App;