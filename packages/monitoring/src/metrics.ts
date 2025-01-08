import client from 'prom-client';

// Initialize metrics
export const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metrics based on PRD Section 5
export const transactionCounter = new client.Counter({
    name: 'haikou_transactions_total',
    help: 'Total number of transactions processed'
});

export const agentOperationsCounter = new client.Counter({
    name: 'haikou_agent_operations_total',
    help: 'Total number of AI agent operations',
    labelNames: ['type', 'level']
});

// Health checks
export const healthCheck = async () => {
    try {
        const { prisma } = await import('@haikou/database');
        const { redis } = await import('@haikou/cache');
        await prisma.$queryRaw`SELECT 1`;
        await redis.ping();
        return true;
    } catch (error) {
        return false;
    }
};