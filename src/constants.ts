import dotenv from 'dotenv'
dotenv.config()

export const SERVER_PORT = process.env.SERVER_PORT!
export const COOKIE_SECRET = process.env.COOKIE_SECRET!
