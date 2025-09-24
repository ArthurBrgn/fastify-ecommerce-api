import { hash } from 'bcryptjs'
import { RecordNotFoundException } from './../exceptions/RecordNotFoundException.js'
import { Prisma } from './../generated/prisma/client.js'
import { AppPrismaClient } from './../plugins/prismaPlugin.js'
import { UserProfilePatchRequest } from './../schemas/user/profileSchema.js'

export async function getUserInfoById(prisma: AppPrismaClient, userId: number) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } }).catch(() => {
        throw new RecordNotFoundException('User not found')
    })

    return user
}

export async function patchUserInfo(
    prisma: AppPrismaClient,
    userId: number,
    patchData: UserProfilePatchRequest
) {
    const queryData: Prisma.UserUpdateInput = {}

    if (patchData.name) queryData.name = patchData.name
    if (patchData.email) queryData.email = patchData.email

    if (patchData.password) {
        const hashed = await hash(patchData.password, 10)
        queryData.password = hashed
    }

    if (patchData.address) {
        const { street, city, country, zipcode } = patchData.address

        if (street !== undefined) queryData.street = street
        if (city !== undefined) queryData.city = city
        if (country !== undefined) queryData.country = country
        if (zipcode !== undefined) queryData.zipcode = zipcode
    }

    return await prisma.user.update({
        where: { id: userId },
        data: queryData
    })
}
