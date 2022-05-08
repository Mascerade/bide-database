import { Prisma } from '@prisma/client'
import { Request, Response } from 'express'
import { prisma } from '../db'
import { checkUserGroup } from '../database-abstractions'

export const createPost = async (req: Request, res: Response) => {
  // Frontend must have the id of the user AND the group meaning the data structures must store it
  req.body.authorId = parseInt(req.body.authorId)
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
