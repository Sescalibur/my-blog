import express from 'express'
import { createRouter } from './routes/index'

const app = express()
app.use(express.json())

// API routes
const apiRouter = createRouter()
app.use('/api', apiRouter)  // /api prefix'ini burada ekliyoruz

export { app } 