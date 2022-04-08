import { Group, Prisma, User } from '@prisma/client'
import { prisma } from './db'

export const checkUserGroup = async function (
  userId: User['id'],
  groupId: Group['id']
): Promise<Boolean> {
  // Find the user and return the group that the post is associated with
  // We can the check that groups is not null (meaning that they belong to the groupa and can post.)

  const foundUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      userGroups: {
        where: {
          id: groupId
        }
      }
    }
  })

  console.log(foundUser)

  if (foundUser?.userGroups[0] != null) {
    return true
  } else {
    return false
  }
}

export const checkExistenceOfUser = async (conditions: {
  id?: User['id']
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
  username?: User['username']
}) => {
  const user = await prisma.user.findUnique({
    where: conditions
  })

  return user
}

export const getAllUniqueUser = async (conditions: {
  id?: User['id']
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
