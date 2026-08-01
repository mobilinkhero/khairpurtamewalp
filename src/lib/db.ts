import { PrismaClient } from '@prisma/client'

const DB_URL = 'postgresql://postgres:2S5N_5%26zyB.e98g@db.bxvecflszxrkrguihzxq.supabase.co:5432/postgres'

// Prevent multiple Prisma instances in development (hot reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: DB_URL } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
