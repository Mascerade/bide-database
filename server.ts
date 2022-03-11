import { GeneralToken, Group, Prisma, User } from '@prisma/client'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { prisma } from './src/db'
import { checkUserGroup } from './src/databaseHelpers'
import { SERVER_PORT } from './src/constants'
import { Undefinable } from './types/helpers'

const app = express()
app.use(
  cors({
    origin: '*'
  })
)
app.use(express.json())

app.post('/user', async (req: Request, res: Response) => {
  const userToCreate: Prisma.UserCreateManyInput = req.body

  try {
    // Create a user
    const userCreated = await prisma.user.create({
      data: {
        ...userToCreate
      }
    })
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
})

app.delete('/user/:id', async (req: Request, res: Response) => {
  const userToDelete: User['id'] = req.params.id

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
})

app.put('/user/:id', async (req: Request, res: Response) => {
  const userToUpdate: User['id'] = req.params.id
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
})

app.get('/user/:id', async (req: Request, res: Response) => {
  const userId: User['id'] = req.params.id
  try {
    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        userGroups: {
          include: {
            group: true
          }
        },
        groupGeneralTokens: true
      }
    })
    if (foundUser == null) {
      return res.status(404).json({ user: null, message: 'User not found.' })
    }
    return res.status(200).json({ user: foundUser })
  } catch (e) {
    return res
      .status(400)
      .json({ user: null, message: 'Unable to find the user.' })
  }
})

app.get('/validate-new-user', async (req: Request, res: Response) => {
  // Know that the ID and username must be strings
  let userId = req.query.userId as string
  let username = req.query.username as string

  // Will append the different errors found to the lists
  let userIdErrors: Array<string> = []
  let usernameErrors: Array<string> = []

  // Check to make sure the user ID does not already exists
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (user != null) {
      userIdErrors.push('ID already exists.')
    }
  } catch (e) {
    userIdErrors.push(`Validation issue with ID.`)
  }

  // Check to make sure the user's username does not already exist
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })
    if (user != null) {
      usernameErrors.push('Username already exists.')
    }
  } catch (e) {
    usernameErrors.push('Validation issue with username.')
  }

  return res
    .status(200)
    .json({ userIdErrors: userIdErrors, usernameErrors: usernameErrors })
})

app.get('/user-posts/:id', async (req: Request, res: Response) => {
  const userId: User['id'] = req.params.id

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
})

app.post('/group', async (req: Request, res: Response) => {
  const creatorUser: User['id'] = req.body.userId
  const groupToCreate: Omit<Prisma.GroupCreateManyInput, 'id'> =
    req.body.groupData

  try {
    await prisma.$transaction(async (prisma) => {
      const groupCreated: Group = await prisma.group.create({
        data: {
          ...groupToCreate
        }
      })

      // Add to GroupUser to indicate that the user is a part of the group
      await prisma.groupUser.create({
        data: {
          userId: creatorUser,
          groupId: groupCreated.id
        }
      })

      // Add to GeneralTokenGroupUser to indicate that the user is the administrator of the group
      await prisma.generalTokenGroupUser.create({
        data: {
          generalTokenId: 'administrator',
          groupId: groupCreated.id,
          userId: creatorUser
        }
      })
    })
    return res.status(201).json({ message: 'Group was successfully created' })
  } catch (e) {
    console.error(e)
    return res.status(400).json({ message: 'Unable to create new group.' })
  }
})

app.delete('/group/:id', async (req: Request, res: Response) => {
  const groupId: Group['id'] = parseInt(req.params.id)

  try {
    await prisma.group.delete({
      where: {
        id: groupId
      }
    })
    return res.status(200).json({ message: 'Successfully deleted the group.' })
  } catch (e) {
    console.error(e)
    return res.status(400).json({ message: 'Unable to delete the group.' })
  }
})

app.get('/group/:id', async (req: Request, res: Response) => {
  const groupId: Group['id'] = parseInt(req.params.id)

  try {
    const group = await prisma.group.findUnique({
      where: {
        id: groupId
      },
      include: {
        groupUsers: {
          include: {
            user: true
          }
        },
        posts: true
      }
    })
    if (group) {
      return res.status(200).json({ group: group })
    } else {
      return res
        .status(404)
        .json({ message: `Could not find group with ID ${groupId}` })
    }
  } catch (e) {
    return res.status(400).json({ message: 'Could not find the group.' })
  }
})

app.get('/group-users/:id', async (req: Request, res: Response) => {
  const groupId: Group['id'] = parseInt(req.params.id)

  try {
    const groupUsers = await prisma.group.findUnique({
      where: {
        id: groupId
      },
      include: {
        groupUsers: {
          include: {
            user: true
          }
        }
      }
    })
    return res.status(200).json(groupUsers)
  } catch (e) {
    return res.status(400).json({ message: 'Could not find the group.' })
  }
})

app.get('/group-posts/:id', async (req: Request, res: Response) => {
  const groupId: Group['id'] = req.body.id

  try {
    const groupPosts = await prisma.group.findUnique({
      where: {
        id: groupId
      },
      include: {
        posts: {
          include: {
            author: true
          }
        }
      }
    })
    return res.status(200).json(groupPosts)
  } catch (e) {
    return res.status(400).json({ message: 'Could not find the group.' })
  }
})

app.post('/post', async (req: Request, res: Response) => {
  // Frontend must have the id of the user AND the group meaning the data structures must store it
  const postToCreate: Omit<Prisma.PostCreateManyInput, 'id'> = req.body

  try {
    // Make sure the user is part of the group
    const createCheck = await checkUserGroup(
      postToCreate.authorId,
      postToCreate.groupId
    )
    console.log(createCheck)

    if (createCheck) {
      // Create a post
      await prisma.post.create({
        data: {
          ...postToCreate
        }
      })

      return res.status(201).json({ message: 'Post was successfully created' })
    } else {
      // If the user tried to create a post in a group they are not a part of
      return res.status(409).json({ message: 'User not part of the group.' })
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({ message: 'Unable to create a new post.' })
  }
})

app.post('/general-token', async (req: Request, res: Response) => {
  const tokenToCreate: Prisma.GeneralTokenCreateManyInput = req.body

  try {
    // Create the token
    await prisma.generalToken.create({
      data: {
        ...tokenToCreate
      }
    })

    return res
      .status(201)
      .json({ message: 'General token was successfully created' })
  } catch (e) {
    console.error(e)
    res.status(400).json({ message: 'Unable to create the general token.' })
  }
})

app.put('/general-token/:id', async (req: Request, res: Response) => {
  // For now, the ID of the token cannot be changed
  const tokenId: GeneralToken['id'] = req.params.id
  const tokenToUpdate: Undefinable<
    Omit<Prisma.GeneralTokenCreateManyInput, 'id'>
  > = req.body

  try {
    // Update the token
    await prisma.generalToken.update({
      where: {
        id: tokenId
      },
      data: {
        ...tokenToUpdate
      }
    })
    return res
      .status(201)
      .json({ message: 'General token was successfully updated.' })
  } catch (e) {
    console.log(e)
    return res
      .status(400)
      .json({ message: 'Unable to update the general token.' })
  }
})

app.listen(3000, () => {
  console.log(`Bide database server ready at: http://localhost:${SERVER_PORT}`)
})
