import { Prisma, GeneralToken } from '@prisma/client'
import { Request, Response } from 'express'
import { prisma } from '../db'
import { Undefinable } from '../../types/helpers'

export const createGeneralToken = async (req: Request, res: Response) => {
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
}

export const updateGeneralToken = async (req: Request, res: Response) => {
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
}
