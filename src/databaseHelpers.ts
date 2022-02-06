import { Group, Prisma, User } from '@prisma/client'
import { prisma } from './db'

export const checkUserGroup = async function (userId: User['id'], groupId: Group['id']): Promise<Boolean> {
  // Find the user and return the group that the post is associated with
  // We can the check that groups is not null (meaning that they belong to the groupa and can post.)

  const foundUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      groups: {
        where: {
          id: groupId
        }
      }
    }
  })

  console.log(foundUser)

  if (foundUser?.groups[0] != null) {
    return true
  } else {
    return false
  }
}