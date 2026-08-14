import { Router } from 'express'
import { query } from '../db/index.js'

export const healthRouter = Router()

// Basic liveness check for the API process itself
healthRouter.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Liveness check that also confirms the DB connection is up
healthRouter.get('/health/db', async (req, res) => {
  try {
    const result = await query('SELECT now() AS db_time')
    res.json({ status: 'ok', dbTime: result.rows[0].db_time })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})
