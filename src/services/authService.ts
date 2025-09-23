import bcrypt from 'bcryptjs'
import { AuthenticationException } from './../exceptions/auth/AuthenticationException.js'
import { RegisterException } from './../exceptions/auth/RegisterException.js'
import { AppPrismaClient } from './../plugins/prismaPlugin.js'
import { LoginRequest, RegisterRequest } from './../schemas/authSchema.js'

export async function loginUser(
    prisma: AppPrismaClient,
    loginRequest: LoginRequest
): Promise<number> {
    const { email, password } = loginRequest

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
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

    return user.id
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
