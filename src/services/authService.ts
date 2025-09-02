import { LoginRequest, RegisterRequest } from '@/schemas/authSchema'
import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function loginUser(loginRequest: LoginRequest): Promise<User> {
    const { email, password } = loginRequest

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

export async function registerUser(registerRequest: RegisterRequest): Promise<User> {
    const userExists = await prisma.user.findUnique({ where: { email: registerRequest.email } })

    if (userExists) {
        throw new Error('Email already in use')
    }

    const { name, email, password, address } = registerRequest
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
        data: {
            name,
            email: email,
            password: hashedPassword,
            ...address
        }
    })
}
