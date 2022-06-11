import { Prisma } from '@prisma/client'
import { Request, RequestHandler, Response } from 'express'
import { prisma } from '../db'
import { checkUserGroup } from '../database-abstractions'

export const groupNameToId: RequestHandler = async (req, res, next) => {
  const groupName: string = req.body.groupName
  const group = await prisma.group.findUnique({
    where: {
      name: groupName
    }
  })
  delete req.body.groupName
  req.body.groupId = group?.id
  next()
}

export const createPost = async (req: Request, res: Response) => {
  console.log(req.body)
  // Frontend must have the id of the user AND the group meaning the data structures must store it
  req.body.authorId = req.session.userId
  req.body.groupId = parseInt(req.body.groupId)
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
      return res.status(403).json({ message: 'User not part of the group.' })
    }
  } catch (e) {
    console.error(e)
    return res.status(400).json({ message: 'Unable to create a new post.' })
  }
}
