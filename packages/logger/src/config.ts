// packages/logger/src/config.ts
import path from 'path';
import winston from 'winston';

// Ensure we're using absolute paths
const LOG_DIR = path.join(process.cwd(), 'logs');

// Create transport for file logs
const createFileTransport = (level: string) => {
    return new winston.transports.File({
        dirname: LOG_DIR,
        filename: `${level}.log`,
        level,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    });
};

export const loggerConfig = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'white'
    },
    transports: [
        // Error logs
        createFileTransport('error'),
        // Combined logs
        createFileTransport('combined'),
        // Console for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
                        }`;
                })
            )
        })
    ]
};