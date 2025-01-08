// packages/backend/src/routes/test.ts
import express from 'express';
import { createLogger } from '@haikou/logger';

const router = express.Router();
const logger = createLogger('test-route');

router.get('/test-logging', (req, res) => {
    try {
        // Test different log levels
        logger.info('This is an info message', { route: '/test-logging' });
        logger.debug('This is a debug message', { timestamp: new Date() });
        logger.http('Incoming request to test endpoint', {
            method: req.method,
            path: req.path,
            query: req.query
        });

        // Test warning
        logger.warn('This is a warning message', {
            someData: 'test warning data'
        });

        // Test error with try-catch
        throw new Error('Test error message');
    } catch (error) {
        logger.error('An error occurred in test route', error instanceof Error ? error : new Error('Unknown error'));

        // Send response even if there's an error
        return res.status(200).json({
            message: 'Logging test completed - check logs',
            status: 'success',
            logFiles: {
                error: 'logs/error.log',
                combined: 'logs/combined.log'
            }
        });
    }
});

export default router;