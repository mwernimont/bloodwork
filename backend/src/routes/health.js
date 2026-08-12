import { Router } from 'express'
import { query } from '../db/index.js'

export const healthRouter = Router()

healthRouter.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

healthRouter.get('/health/db', async (req, res) => {
  try {
    const result = await query('SELECT now() AS db_time')
    res.json({ status: 'ok', dbTime: result.rows[0].db_time })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})
