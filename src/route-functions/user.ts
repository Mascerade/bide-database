import { Prisma, User } from '@prisma/client'
import { RequestHandler, ErrorRequestHandler, Request, Response } from 'express'
import { prisma } from '../db'
import { Undefinable } from '../../types/helpers'
import bcrypt from 'bcrypt'
import {
  getAllUniqueUser,
  checkExistenceOfUser
} from '../database-abstractions'

const SALT_ROUNDS = 10

export const createUser: RequestHandler = async (req, res) => {
  const userToCreate: Prisma.UserCreateManyInput = req.body

  try {
    const hash = await bcrypt.hash(userToCreate.password, SALT_ROUNDS)
    userToCreate.password = hash
    const userCreated = await prisma.user.create({
      data: {
        ...userToCreate
      }, 
      include: {
        userGroups: {
          include: {
            group: true
          }
        },
        joinGroupRequests: true,
        groupGeneralTokens: true,
        posts: {
          include: {
            group: true
          }
        }
      }
    })

    // Set the cookie
    req.session.userId = userCreated.id

    // Created the user
    return res.status(201).json({
      user: userCreated,
      message: 'User was successfully created'
    })
  } catch (e) {
    console.error(e)
    return res
      .status(400)
      .json({ user: undefined, message: 'Unable to create new user.' })
  }
}

export const deleteUser: RequestHandler = async (req, res) => {
  const userToDelete: User['id'] = parseInt(req.params.id, 10)

  try {
    // Delete the user
    await prisma.user.delete({
      where: {
        id: userToDelete
      }
    })

    // Deleted the user
    return res.status(201).json({ message: 'User was successfully deleted.' })
  } catch (e) {
    console.error(e)
    return res.status(400).json({ message: 'Unable to delete the user.' })
  }
}

export const updateUser: RequestHandler = async (req, res) => {
  const userToUpdate: User['id'] = parseInt(req.params.id, 10)
  const newUserInformation: Undefinable<Omit<User, 'id'>> = req.body

  try {
    // Update the user
    await prisma.user.update({
      where: {
        id: userToUpdate
      },
      data: {
        ...newUserInformation
      }
    })
    return res.status(201).json({ message: 'User was successfully updated.' })
  } catch (e) {
    return res.status(400).json({ message: 'Unable to update the user.' })
  }
}

export const getUserFromCookie: RequestHandler = async (req, res) => {
  if (req.session.userId) {
    const user = await getAllUniqueUser({ id: req.session.userId })
    if (user) {
      return res.status(200).json({ user: user })
    } else {
      return res
        .status(404)
        .json({ user: null, message: 'User could not be found from cookie' })
    }
  } else {
    return res.status(404).json({ user: null, message: 'Cookie not set' })
  }
}

export const cookieCheck: RequestHandler = async (req, res) => {
  if (req.session.userId) {
    if (await checkExistenceOfUser({ id: req.session.userId })) {
      return res.status(200).json({ message: 'Found the user.' })
    } else {
      return res.status(404).json({ message: 'User not found.' })
    }
  } else {
    // The user has not logged in yet to have a cookie or the cookie just expired
    return res.status(404).json({ message: 'Cookie not set' })
  }
}

export const login: RequestHandler = async (req, res) => {
  const email: User['email'] = req.query.email as string
  const password: User['password'] = req.query.password as string
  const foundUser = await getAllUniqueUser({ email: email })

  // User was not found
  if (foundUser == null) {
    return res.status(404).json({ user: null, message: 'User not found.' })
  }

  const passwordMatches = await bcrypt.compare(password, foundUser.password)
  if (passwordMatches) {
    // Set the cookie
    req.session.userId = foundUser.id
    return res.status(200).json({ user: foundUser })
  } else {
    return res.status(401).json({ user: null, message: 'Invalid password.' })
  }
}

export const logout: RequestHandler = async (req, res) => {
  req.session.userId = undefined
  return res.status(200).json({ message: 'Successfully logged out the user.' })
}

export const getUserFromId: RequestHandler = async (req, res, next) => {
  const userId: User['id'] = parseInt(req.params.id)
  const foundUser = await getAllUniqueUser({ id: userId })

  if (foundUser == null) {
    return res.status(404).json({ user: null, message: 'User not found.' })
  }

  return res.status(200).json({ user: foundUser })
}

export const validateNewUser: RequestHandler = async (req, res) => {
  // Know that the ID and username must be strings
  let email = req.query.email as string
  let username = req.query.username as string

  // Will append the different errors found to the lists
  let emailErrors: Array<string> = []
  let usernameErrors: Array<string> = []

  // Check to make sure the user ID does not already exists
  try {
    if (await checkExistenceOfUser({ email: email })) {
      emailErrors.push('Email already exists.')
    }
  } catch (e) {
    emailErrors.push(`Validation issue with ID.`)
  }

  // Check to make sure the user's username does not already exist
  try {
    if (await checkExistenceOfUser({ username: username })) {
      usernameErrors.push('Username already exists.')
    }
  } catch (e) {
    usernameErrors.push('Validation issue with username.')
  }

  return res
    .status(200)
    .json({ emailErrors: emailErrors, usernameErrors: usernameErrors })
}

export const getUserPosts: RequestHandler = async (req, res) => {
  const userId: User['id'] = parseInt(req.params.id, 10)

  try {
    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        posts: {
          include: {
            group: true
          }
        }
      }
    })
    return res.status(200).json(foundUser)
  } catch (e) {
    return res.status(400).json({ message: 'Unable to find the user.' })
  }
}
