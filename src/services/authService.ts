import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        throw new Error('Invalid email or password')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new Error('Invalid email or password')
    }

    return user
}

export async function registerUser() {
    // TODO
}
