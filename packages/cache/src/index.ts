import IORedis from 'ioredis';
import Bull from 'bull';

export const redis = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
});

export const createQueue = (name: string) => {
  return new Bull(name, {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    }
  });
};

// Queues based on PRD requirements
export const treasuryQueue = createQueue('treasury');
export const governanceQueue = createQueue('governance');
export const securityQueue = createQueue('security');
