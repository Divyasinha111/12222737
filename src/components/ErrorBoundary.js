// Frontend Test Submission/components/ErrorBoundary.js
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { log } from '../LoggingMiddleware/logger';
import '../styles/ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo); // Use console.error initially for quick debugging
    log('fatal', 'ErrorBoundary', `Application crashed: ${error.message}`, errorInfo.componentStack);
    this.setState({ error: error, errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Paper className="error-boundary-container" elevation={3}>
          <Typography variant="h5" color="error" gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We're sorry for the inconvenience. Please try refreshing the page or contact support if the issue persists.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
          {this.state.error && (
            <Box sx={{ mt: 3, p: 2, border: '1px dashed #ccc', bgcolor: '#f5f5f5', overflow: 'auto' }}>
              <Typography variant="subtitle2" color="text.secondary">Error Details:</Typography>
              <Typography variant="body2" component="pre">
                {this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </Typography>
            </Box>
          )}
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;