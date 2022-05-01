import { Group, Prisma, User } from '@prisma/client'
import { Request, RequestHandler, Response } from 'express'
import { createGroup } from '../database-abstractions'
import { prisma } from '../db'

export const createGroupUsingUserCookie: RequestHandler = async (req, res) => {
  const userId = req.session.userId
  const groupToCreate = req.body.groupData

  if (!userId) {
    return res.status(401).json({ message: 'User not logged in.' })
  }

  const result = await createGroup(userId, groupToCreate)
  if (result.success) {
    return res.status(201).json({ message: 'Group was successfully created' })
  } else {
    return res.status(400).json({ message: 'Unable to create new group.' })
  }
}

export const deleteGroup: RequestHandler = async (req, res) => {
  const userId = req.session.userId
  const groupId: Group['id'] = parseInt(req.params.id)

  if (!userId) {
    return res.status(401).json({ message: 'User not logged in.' })
  }

  try {
    const exists = await prisma.generalTokenGroupUser.findFirst({
      where: {
        userId: userId,
        groupId: groupId,
        generalTokenId: 'administrator'
      }
    })

    if (!exists) {
      return res.status(401).json({
        message: 'User does not have permission to delete this group.'
      })
    }
  } catch (e) {
    console.log(e)
    throw e
  }

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

export const getGroup: RequestHandler = async (req: Request, res: Response) => {
  const groupName: Group['name'] = req.params.groupName

  try {
    const group = await prisma.group.findUnique({
      where: {
        name: groupName
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
        .json({ message: `Could not find group with name of ${groupName}` })
    }
  } catch (e) {
    return res.status(400).json({ message: 'Could not find the group.' })
  }
}

export const getGroupUsers: RequestHandler = async (req, res) => {
  const groupName: Group['name'] = req.params.name

  try {
    const groupUsers = await prisma.group.findUnique({
      where: {
        name: groupName
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

export const getGroupPosts: RequestHandler = async (req, res) => {
  const groupName: Group['name'] = req.params.name

  try {
    const groupPosts = await prisma.group.findUnique({
      where: {
        name: groupName
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
