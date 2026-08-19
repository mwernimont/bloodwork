import { Router } from 'express'
import { prisma } from '../db/index.js'

export const healthRouter = Router()

// Basic liveness check for the API process itself
healthRouter.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Liveness check that also confirms the DB connection is up
healthRouter.get('/health/db', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT now() AS db_time`
    res.json({ status: 'ok', dbTime: result[0].db_time })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})
