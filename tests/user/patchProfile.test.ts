import { buildApp } from '@/app'
import { UserProfilePatchRequest } from '@/schemas/user/profileSchema'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, it, expect } from 'vitest'
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
