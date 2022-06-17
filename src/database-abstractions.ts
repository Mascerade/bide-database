import { Group, Prisma, User } from '@prisma/client'
import { prisma } from './db'

export const checkUserGroup = async function (
  userId: User['id'],
  groupId: Group['id']
): Promise<Boolean> {
  // Find the user and return the group that the post is associated with
  // We can the check that groups is not null (meaning that they belong to the group and can post.)
  const foundUser = await prisma.groupUser.findUnique({
    where: {
      userId_groupId: { userId, groupId }
    }
  })

  console.log(foundUser)

  if (foundUser != null) {
    return true
  } else {
    return false
  }
}

export const checkExistenceOfUser = async (conditions: {
  id?: User['id']
  email?: User['email']
  username?: User['username']
}): Promise<Boolean> => {
  try {
    // Check that a user exists given their ID
    const foundUser = await prisma.user.findUnique({
      where: conditions
    })

    if (foundUser != null) {
      return true
    } else {
      return false
    }
  } catch (e) {
    throw e
  }
}

export const getUserProfileInformation = async (conditions: {
  id?: User['id']
  email: User['email']
  username?: User['username']
}) => {
  const user = await prisma.user.findUnique({
    where: conditions
  })

  return user
}

export const getAllUniqueUser = async (conditions: {
  id?: User['id']
  email?: User['email']
  username?: User['username']
}) => {
  try {
    const user = await prisma.user.findUnique({
      where: conditions,
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

    return user
  } catch (e) {
    return null
  }
}

export const getUserFromUsername = async (
  username: string
): Promise<User | null> => {
  const foundUser = await prisma.user.findUnique({
    where: {
      username: username
    }
  })

  return foundUser
}

export const createGroup = async (
  creatorUser: User['id'],
  groupToCreate: Omit<Prisma.GroupCreateManyInput, 'id'>
): Promise<{ success: boolean }> => {
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
    return { success: true }
  } catch (e) {
    console.error(e)
    throw e
  }
}
