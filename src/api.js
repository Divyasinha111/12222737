// src/api.js
import { log } from './LoggingMiddleware/logger'; // <--- VERIFY THIS PATH CAREFULLY

const BASE_URL = 'http://20.244.56.144/evaluation-service';
let accessToken = '';

export const registerUser = async (email, rollNumber, name, accessCode) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, rollNumber, name, accessCode }),
    });

    const data = await response.json();
    if (!response.ok) {
      log('error', 'api', `Registration failed: ${data.message || response.statusText}`, data);
      throw new Error(data.message || 'Registration failed');
    }
    log('info', 'api', 'User registered successfully.', { email, rollNumber, name });
    return data;
  } catch (error) {
    log('error', 'api', `Error during registration: ${error.message}`, error.stack);
    throw error;
  }
};

export const authenticateUser = async (email, rollNumber) => {
  try {
    const response = await fetch(`${BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, rollNumber }),
    });

    const data = await response.json();
    if (!response.ok) {
      log('error', 'api', `Authentication failed: ${data.message || response.statusText}`, data);
      throw new Error(data.message || 'Authentication failed');
    }
    accessToken = data.access_token;
    log('info', 'api', 'User authenticated successfully. Access token received.', { email });
    return accessToken;
  } catch (error) {
    log('error', 'api', `Error during authentication: ${error.message}`, error.stack);
    throw error;
  }
};

const getAuthHeaders = () => {
  if (!accessToken) {
    log('warn', 'api', 'Access token is not available for API call.');
    throw new Error('Authentication required. Please register and authenticate first.');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };
};

export const shortenUrl = async (originalUrl, customCode, expirationMinutes) => {
  try {
    const payload = {
      originalUrl,
      customCode,
      expirationMinutes: expirationMinutes || 30,
    };

    const response = await fetch(`${BASE_URL}/shorten`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 409 && data.message && data.message.includes('custom code already exists')) {
        log('warn', 'api', `Custom shortcode conflict: ${data.message}`, payload);
        throw new Error(`Custom shortcode '${customCode}' is already in use. Please choose another.`);
      }
      log('error', 'api', `URL shortening failed: ${data.message || response.statusText}`, data);
      throw new Error(data.message || 'URL shortening failed');
    }
    log('info', 'api', 'URL shortened successfully.', { originalUrl, shortCode: data.shortCode });
    return data;
  } catch (error) {
    log('error', 'api', `Error shortening URL: ${error.message}`, error.stack);
    throw error;
  }
};

export const getOriginalUrlAndLogClick = async (shortCode) => {
  try {
    const response = await fetch(`${BASE_URL}/resolve/${shortCode}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      log('error', 'api', `Failed to resolve short URL ${shortCode}: ${data.message || response.statusText}`, data);
      throw new Error(data.message || 'Failed to resolve short URL');
    }
    log('info', 'api', `Resolved short URL ${shortCode} to ${data.originalUrl}. Click logged.`, data);
    return data.originalUrl;
  } catch (error) {
    log('error', 'api', `Error resolving short URL ${shortCode}: ${error.message}`, error.stack);
    throw error;
  }
};

export const getUrlStatistics = async (shortCode = '') => {
  try {
    const url = shortCode ? `${BASE_URL}/stats/${shortCode}` : `${BASE_URL}/stats`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      log('error', 'api', `Failed to fetch statistics: ${data.message || response.statusText}`, data);
      throw new Error(data.message || 'Failed to fetch statistics');
    }
    log('info', 'api', `Successfully fetched statistics for ${shortCode || 'all URLs'}.`, data);
    return data;
  } catch (error) {
    log('error', 'api', `Error fetching statistics: ${error.message}`, error.stack);
    throw error;
  }
};

export const setAccessToken = (token) => {
  accessToken = token;
  log('info', 'api', 'Access token set programmatically.', { tokenExists: !!token });
};