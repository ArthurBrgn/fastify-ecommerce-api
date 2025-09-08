import { buildApp } from '@/app'
import type { UserProfileResponse } from '@/schemas/authSchema'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { resetDatabase } from './../utils/resetDatabase'

let server: FastifyInstance
let token: string

const testEmail = 'me@example.com'
const testPassword = 'Password123'

const userData = {
    name: 'Test User',
    email: testEmail,
    street: '123 Test St',
    city: 'TestCity',
    country: 'TestCountry',
    zipcode: '12345'
}

const getUserProfile = (authToken?: string) =>
    supertest(server.server)
        .get('/api/me')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')

beforeAll(async () => {
    server = await buildApp()
    await server.ready()
})

beforeEach(async () => {
    await resetDatabase(server.prisma)

    const createdUser = await server.prisma.user.create({
        data: {
            ...userData,
            password: await hash(testPassword, 10)
        }
    })

    token = await server.jwt.sign({ id: createdUser.id })
})

afterAll(async () => {
    await server.close()
})

describe('GET /api/me (User profile)', () => {
    it('should return user data successfully', async () => {
        const response = await getUserProfile(token)
        expect(response.status).toBe(200)

        const body: UserProfileResponse = response.body

        expect(body).toMatchObject({
            id: expect.any(Number),
            name: userData.name,
            email: userData.email,
            street: userData.street,
            city: userData.city,
            country: userData.country,
            zipcode: userData.zipcode
        })

        expect(body).not.toHaveProperty('password')
        expect(new Date(body.createdAt).toString() !== 'Invalid Date').toBe(true)
    })

    it('should return 401 if token is not present', async () => {
        const response = await getUserProfile()
        expect(response.status).toBe(401)
    })

    it('should return 401 if token is invalid', async () => {
        const response = await getUserProfile('invalid.token')
        expect(response.status).toBe(401)
    })

    it('should return 404 if user does not exist anymore', async () => {
        await server.prisma.user.delete({ where: { email: testEmail } })

        const response = await getUserProfile(token)
        expect(response.status).toBe(404)
    })
})
