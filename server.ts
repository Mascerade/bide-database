import { Prisma } from '@prisma/client'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { prisma } from './src/db'
import { checkUserGroup } from './src/databaseHelpers'
import { SERVER_PORT } from './src/constants'

const app = express()
app.use(cors({
  origin: '*'
}))
app.use(express.json())

app.post('/user', async (req: Request, res: Response) => {
  const userToCreate: Prisma.UserCreateManyInput = req.body;

  try {
    // Create a user
    await prisma.user.create({
      data: {
        ...userToCreate
      }
    })
    // Created the user
    return res.status(201).json({ message: 'User was successfully created' })
  } catch (e) {
    console.error(e)
    return res.status(400).json({ message: 'Unable to create new user.' })
  }
})

app.delete('/user/:id', async (req: Request, res: Response) => {
  const userToDelete: string = req.body.id

  try {
    // Delete the user
    await prisma.user.delete({
      where: {
        id: userToDelete
      }
    })
    // Deleted the user
    return res.status(201).json({ message: 'User was succesfully deleted.' })
  } catch (e) {
    console.error(e)
    return res.status(400).json({ message: 'Unable to delete the user.' })
  }
})

app.post('/group', async (req: Request, res: Response) => {
  const groupToCreate: Prisma.GroupCreateManyInput = req.body;

  try {
    // TODO: When creating a group, a specific user must have created the group
    //       meaning not only do we have to make sure we update the user with the group
    //       we also must add an administrator token to that user for that particular group
    // Create a group
    await prisma.group.create({
      data: {
        ...groupToCreate
      }
    })
    // Created the group
    return res.status(201).json({ message: 'Group was successfully created' })
  } catch (e) {
    console.error(e)
    return res.status(400).json({ message: 'Unable to create new group.' })
  }
})

app.post('/post', async (req: Request, res: Response) => {
  // Frontend must have the id of the user AND the group meaning the data structures must store it
  const postToCreate: Prisma.PostCreateManyInput = req.body

  try {
    // Make sure the user is part of the group
    const createCheck = await checkUserGroup(postToCreate.authorId, postToCreate.groupId)
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

app.listen(3000, () => {
  console.log(`Bide database server ready at: http://localhost:${SERVER_PORT}`)
})