import { buildApp } from '@/app'
import { User } from '@/generated/prisma/client'
import { UserProfilePatchRequest } from '@/schemas/user/profileSchema'
import { compare, hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { resetDatabase } from '../utils/resetDatabase'

let server: FastifyInstance

let user: User
let token: string

const patchUser = (payload: UserProfilePatchRequest = {}, authToken?: string) => {
    return supertest(server.server)
        .patch('/api/users/me')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .send(payload)
}

beforeAll(async () => {
    server = await buildApp()
    await server.ready()
})

beforeEach(async () => {
    await resetDatabase(server.prisma)

    const createUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: await hash('Password123', 10),
        street: '123 Test St',
        city: 'TestCity',
        country: 'TestCountry',
        zipcode: '12345'
    }

    user = await server.prisma.user.create({
        data: createUserData,
        omit: { password: false }
    })

    token = await server.jwt.sign({ id: user.id })
})

afterAll(async () => {
    await server.close()
})

describe('PATCH api/users/me', () => {
    it('should update name and email successfully', async () => {
        const payload = { name: 'Updated Name', email: 'updated@example.com' }
        const { status, body } = await patchUser(payload, token)

        expect(status).toBe(200)
        expect(body.name).toBe(payload.name)
        expect(body.email).toBe(payload.email)

        const dbUser = await server.prisma.user.findUnique({ where: { id: user.id } })
        expect(dbUser?.name).toBe(payload.name)
        expect(dbUser?.email).toBe(payload.email)
    })

    it('should update password and hash it', async () => {
        const payload = { password: 'NewPassword123', password_confirm: 'NewPassword123' }
        const { status } = await patchUser(payload, token)
        expect(status).toBe(200)

        const dbUser = await server.prisma.user.findUnique({
            where: { id: user.id },
            omit: { password: false }
        })
        expect(dbUser).toBeDefined()
        const match = dbUser && (await compare('NewPassword123', dbUser.password))
        expect(match).toBe(true)
    })

    it('should update partial address', async () => {
        const payload = { address: { city: 'NewCity', zipcode: '54321' } }
        const { status, body } = await patchUser(payload, token)
        expect(status).toBe(200)
        expect(body.city).toBe('NewCity')
        expect(body.zipcode).toBe('54321')
        expect(body.street).toBe(user.street)
    })

    it('should fail with invalid email', async () => {
        const payload = { email: 'invalid-email' }
        const { status, body } = await patchUser(payload, token)

        expect(status).toBe(422)
        expect(body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: 'email', message: 'Invalid email address' })
            ])
        )
    })

    it('should fail if passwords do not match', async () => {
        const payload = { password: 'password', password_confirm: 'password123' }
        const { status, body } = await patchUser(payload, token)
        expect(status).toBe(422)
        expect(body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'password_confirm',
                    message: 'Passwords must match'
                })
            ])
        )
    })

    it('should return 401 if token is not present', async () => {
        const { status, body } = await patchUser()

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })

    it('should return 401 if token is invalid', async () => {
        const { status, body } = await patchUser({}, 'Invalid token')

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })
})
