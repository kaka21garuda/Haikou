import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { loggerConfig } from './config.js';

// Ensure log directory exists
const LOG_DIR = path.join(process.cwd(), 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Add colors to winston
winston.addColors(loggerConfig.colors);

// Create the logger
export const logger = winston.createLogger({
  levels: loggerConfig.levels,
  transports: loggerConfig.transports,
  exitOnError: false
});

// Helper functions with proper typing
export const logError = (message: string, error?: Error, metadata = {}) => {
  logger.error(message, {
    ...metadata,
    ...(error && {
      error: error.message,
      stack: error.stack
    })
  });
};

export const logWarning = (message: string, metadata = {}) => {
  logger.warn(message, { ...metadata });
};

export const logInfo = (message: string, metadata = {}) => {
  logger.info(message, { ...metadata });
};

export const logHTTP = (message: string, metadata = {}) => {
  logger.http(message, { ...metadata });
};

export const logDebug = (message: string, metadata = {}) => {
  logger.debug(message, { ...metadata });
};

// Create module-specific logger
export const createLogger = (module: string) => {
  return {
    error: (message: string, error?: Error, metadata = {}) =>
      logError(message, error, { ...metadata, module }),
    warn: (message: string, metadata = {}) =>
      logWarning(message, { ...metadata, module }),
    info: (message: string, metadata = {}) =>
      logInfo(message, { ...metadata, module }),
    http: (message: string, metadata = {}) =>
      logHTTP(message, { ...metadata, module }),
    debug: (message: string, metadata = {}) =>
      logDebug(message, { ...metadata, module })
  };
};