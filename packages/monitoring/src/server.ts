// src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import { register, transactionCounter, agentOperationsCounter, healthCheck } from './metrics';
import { logger, logError, logInfo, logHTTP, logDebug, logWarning } from '@haikou/logger';

// Middleware
const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  logHTTP(`Incoming request`, {
    method: req.method,
    path: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
};

const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  logError('Unhandled error', err, {
    stack: err.stack
  });
  res.status(500).send('Internal Server Error');
  next(err);
};

// Route handlers
const handleHealth = async (_req: Request, res: Response) => {
  try {
    const isHealthy = await healthCheck();
    if (isHealthy) {
      logInfo('Health check passed');
      res.status(200).send('OK');
    } else {
      logError('Health check failed - services unhealthy');
      res.status(500).send('Services Unhealthy');
    }
  } catch (error) {
    logError('Health check failed', error as Error);
    res.status(500).send('Health Check Failed');
  }
};

const handleMetrics = async (_req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    logError('Metrics collection failed', error as Error);
    res.status(500).send('Metrics Collection Failed');
  }
};

const handleTestLogs = (_req: Request, res: Response) => {
  try {
    logDebug('Debug level test', { timestamp: Date.now() });
    logInfo('Info level test', { user: 'test-user' });
    logWarning('Warning level test', { attention: 'needed' });
    logError('Error level test', new Error('Test error'), { critical: false });
    logHTTP('HTTP level test', { endpoint: '/test/logs' });

    res.status(200).send('Logs generated successfully');
  } catch (error) {
    logError('Failed to generate test logs', error as Error);
    res.status(500).send('Failed to generate logs');
  }
};

const handleTestIncrement = (_req: Request, res: Response) => {
  try {
    transactionCounter.inc();
    agentOperationsCounter.inc({ type: 'TREASURY', level: 'HIGH_AUTONOMY' });
    logInfo('Counters incremented successfully');
    res.status(200).send('Incremented');
  } catch (error) {
    logError('Counter increment failed', error as Error);
    res.status(500).send('Counter Increment Failed');
  }
};

// Server setup
async function startServer() {
  const app = express();
  const PORT = process.env.PROMETHEUS_PORT || 9090;

  // Middleware
  app.use(requestLogger);
  app.use(express.json());

  // Routes
  app.get('/health', handleHealth);
  app.get('/metrics', handleMetrics);
  app.get('/test/logs', handleTestLogs);
  app.post('/test/increment', handleTestIncrement);

  // Error handling middleware - should be last
  app.use(errorHandler);

  return new Promise<void>((resolve, reject) => {
    try {
      const server = app.listen(PORT, () => {
        logInfo('Monitoring server started', {
          port: PORT,
          env: process.env.NODE_ENV,
          nodeVersion: process.version
        });
        resolve();
      });

      // Handle server-specific errors
      server.on('error', (error) => {
        logError('Server error occurred', error as Error);
        reject(error);
      });

    } catch (error) {
      logError('Failed to start server', error as Error);
      reject(error);
    }
  });
}

// Start server with proper error handling
startServer().catch((error) => {
  logError('Fatal error during startup', error as Error);
  process.exit(1);
});