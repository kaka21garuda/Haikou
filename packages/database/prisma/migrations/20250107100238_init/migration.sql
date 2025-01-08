-- CreateEnum
CREATE TYPE "AgentLevel" AS ENUM ('SUPERVISED_EXECUTION', 'CONDITIONAL_AUTONOMY', 'SUPERVISED_AUTONOMY', 'HIGH_AUTONOMY', 'FULL_AUTONOMY');

-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('TREASURY', 'GOVERNANCE', 'SECURITY');

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "level" "AgentLevel" NOT NULL,
    "type" "AgentType" NOT NULL,
    "status" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "chainId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
