import { AuthenticationException } from '@/exceptions/auth/AuthenticationException'
import { RegisterException } from '@/exceptions/auth/RegisterException'
import { AppPrismaClient } from '@/plugins/prismaPlugin'
import { LoginRequest, RegisterRequest } from '@/schemas/authSchema'
import bcrypt from 'bcryptjs'

export async function loginUser(prisma: AppPrismaClient, loginRequest: LoginRequest) {
    const { email, password } = loginRequest

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            password: true
        }
    })

    if (!user) {
        throw new AuthenticationException()
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        throw new AuthenticationException()
    }

    return user
}

export async function registerUser(prisma: AppPrismaClient, registerRequest: RegisterRequest) {
    const userExists = await prisma.user.findUnique({ where: { email: registerRequest.email } })

    if (userExists) {
        throw new RegisterException('Email already in use', 409)
    }

    const { name, email, password, address } = registerRequest
    const hashedPassword = await bcrypt.hash(password, 10)

    return await prisma.user.create({
        data: {
            name,
            email: email,
            password: hashedPassword,
            ...address
        }
    })
}
