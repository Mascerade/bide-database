import express, { ErrorRequestHandler } from 'express'
import { User } from '@prisma/client'
import sessions from 'express-session'
import cors from 'cors'
import { SERVER_PORT, COOKIE_SECRET } from './src/constants'
import * as UserRouteFunctions from './src/route-functions/user'
import * as GroupRouteFunctions from './src/route-functions/group'
import * as PostRouteFunctions from './src/route-functions/post'
import * as GeneralTokenRouteFunctions from './src/route-functions/general-token'

declare module 'express-session' {
  interface SessionData {
    userId: User['id']
  }
}

const app = express()

const sessConfig: sessions.SessionOptions = {
  secret: COOKIE_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // Max age is set to a week
  }
}

if (app.get('production') == 'production') {
  sessConfig.cookie!.secure = true
}

app.use(sessions(sessConfig))

app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true
  })
)

app.use(express.json())

const unhandledError: ErrorRequestHandler = async (err, _, res, __) => {
  return res.status(500).json({ message: `Unhandled error ${err.message}` })
}

// User routes
app.post('/user', UserRouteFunctions.createUser)
app.delete('/user/:id', UserRouteFunctions.deleteUser)
app.put('/user/:id', UserRouteFunctions.updateUser)
app.get('/user/initial-load', UserRouteFunctions.getUserFromCookie)
app.get('/user/check-cookie', UserRouteFunctions.cookieCheck)
app.get('/user/login', UserRouteFunctions.login)
app.get('/user/logout', UserRouteFunctions.logout)
app.get('/user/validate-new-user', UserRouteFunctions.validateNewUser)
app.get('/user/posts/:id', UserRouteFunctions.getUserPosts)
app.get('/user/:id', UserRouteFunctions.getUserFromId)

// Group routes
app.post('/group', GroupRouteFunctions.createGroupUsingUserCookie)
app.put('/group/:name', GroupRouteFunctions.groupNameParamToId)
app.put('/group/:name/request-join', GroupRouteFunctions.requestUserJoinGroup)
app.delete('/group/:id', GroupRouteFunctions.deleteGroup)
app.get('/group/users/:name', GroupRouteFunctions.getGroupUsers)
app.get('/group/posts/:name', GroupRouteFunctions.getGroupPosts)
app.get('/group/:name', GroupRouteFunctions.getGroup)

// Post routes
app.post('/post', PostRouteFunctions.groupNameToId)
app.post('/post', PostRouteFunctions.createPost)

// General Token routes
app.post('/general-token', GeneralTokenRouteFunctions.createGeneralToken)
app.put('/general-token/:id', GeneralTokenRouteFunctions.updateGeneralToken)

// Middleware to catch unexpected errors
app.use('/', unhandledError)

app.listen(3000, () => {
  console.log(`Bide database server ready at: http://localhost:${SERVER_PORT}`)
})
