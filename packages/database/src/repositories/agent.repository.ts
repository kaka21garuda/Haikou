import { prisma } from '../';
import type { Prisma } from '@prisma/client';

export class AgentRepository {
    async create(data: Prisma.AgentCreateInput) {
        return prisma.agent.create({
            data
        });
    }

    async findById(id: string) {
        return prisma.agent.findUnique({
            where: { id }
        });
    }

    async findAll() {
        return prisma.agent.findMany();
    }

    async update(
        id: string,
        data: Prisma.AgentUpdateInput
    ) {
        return prisma.agent.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        return prisma.agent.delete({
            where: { id }
        });
    }
}

export const agentRepository = new AgentRepository();