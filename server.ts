import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { SERVER_PORT } from './src/constants'

const prisma = new PrismaClient()
const app = express()

app.use(cors({
  origin: '*'
}))

app.use(express.json())

app.listen(SERVER_PORT, () => {
  console.log(`Bide database server ready at: http://localhost:${SERVER_PORT}`)
})