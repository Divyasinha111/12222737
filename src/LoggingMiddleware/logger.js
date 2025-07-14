// src/Logging Middleware/logger.js
import { authenticateUser, registerUser, setAccessToken } from '../api'; // <--- VERIFY THIS PATH CAREFULLY

const LOGGING_API_URL = 'http://20.244.56.144/evaluation-service/logs';
const APP_STACK = 'frontend'; // Fixed value as per requirements

let loggingAccessToken = '';

(async () => {
  // IMPORTANT: Replace these with your actual details from the .env file
  // These variables are typically loaded via a build process, but explicitly defining here for clarity.
  // In a Create React App, process.env.REACT_APP_VARIABLE_NAME is how you access .env variables.
  const EMAIL = process.env.REACT_APP_AFFORDMED_EMAIL || 'your-email@example.com';
  const ROLL_NUMBER = process.env.REACT_APP_AFFORDMED_ROLL_NUMBER || 'your-roll-number';
  const NAME = process.env.REACT_APP_AFFORDMED_NAME || 'Your Name';
  const ACCESS_CODE = process.env.REACT_APP_AFFORDMED_ACCESS_CODE;

  if (!ACCESS_CODE) {
    console.error("REACT_APP_AFFORDMED_ACCESS_CODE is not set in your .env file. Logging will not work.");
    return;
  }

  try {
    await registerUser(EMAIL, ROLL_NUMBER, NAME, ACCESS_CODE);
    console.log("Successfully registered for logging.");

    const token = await authenticateUser(EMAIL, ROLL_NUMBER);
    loggingAccessToken = token;
    setAccessToken(token); // Also set it for general API calls
    console.log("Successfully authenticated and obtained logging token.");
  } catch (error) {
    console.error("Failed to register or authenticate for logging:", error);
  }
})();

export const log = async (level, packageName, message, stackTrace = '') => {
  const logData = {
    stack: APP_STACK,
    level: level.toLowerCase(),
    package: packageName,
    message: message,
    ...(stackTrace && { stackTrace: stackTrace }),
  };

  const timestamp = new Date().toISOString();
  if (level === 'error' || level === 'fatal') {
    console.error(`[${timestamp}] [${level.toUpperCase()}] [${packageName}]: ${message}`, stackTrace ? `\n${stackTrace}` : '');
  } else {
    console.log(`[${timestamp}] [${level.toUpperCase()}] [${packageName}]: ${message}`);
  }

  if (!loggingAccessToken) {
    console.warn("Logging API not authenticated yet. Log not sent to server.");
    return;
  }

  try {
    const response = await fetch(LOGGING_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loggingAccessToken}`,
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to send log to API. Status: ${response.status}, Response: ${errorText}`);
    }
  } catch (error) {
    console.error("Error sending log to API:", error);
  }
};