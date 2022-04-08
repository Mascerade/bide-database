import { Group, Prisma, User } from '@prisma/client'
import { Request, Response } from 'express'
import { prisma } from '../db'

export const createGroup = async (req: Request, res: Response) => {
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
}

export const deleteGroup = async (req: Request, res: Response) => {
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
}

export const getGroup = async (req: Request, res: Response) => {
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
}

export const getGroupUsers = async (req: Request, res: Response) => {
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
}

export const getGroupPosts = async (req: Request, res: Response) => {
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
}
