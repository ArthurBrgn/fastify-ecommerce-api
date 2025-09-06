import { buildApp } from '@/app'
import type { UserProfileResponse } from '@/schemas/authSchema'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { resetDatabase } from './utils/resetDatabase'

let server: FastifyInstance
let token: string

const testEmail = 'me@example.com'
const testPassword = 'Password123'

const userData = {
    name: 'Test User',
    email: testEmail,
    address: {
        street: '123 Test St',
        city: 'TestCity',
        country: 'TestCountry',
        zipcode: '12345'
    }
}

const getUserProfile = () =>
    supertest(server.server).get('/api/me').set('Authorization', `Bearer ${token}`).send()

beforeAll(async () => {
    server = await buildApp()
    await server.ready()
})

beforeEach(async () => {
    await resetDatabase(server.prisma)

    const createdUser = await server.prisma.user.create({
        data: {
            name: 'Test User',
            email: testEmail,
            password: await hash(testPassword, 10),
            street: '123 Test St',
            city: 'TestCity',
            country: 'TestCountry',
            zipcode: '12345'
        }
    })

    token = await server.jwt.sign({ id: createdUser.id })
})

afterAll(async () => {
    await server.close()
})

describe('POST /api/me', () => {
    it('should return user data successfully', async () => {
        const response = await getUserProfile()

        const body: UserProfileResponse = response.body

        expect(response.status).toBe(200)

        expect(body).toMatchObject({
            id: expect.any(Number),
            name: userData.name,
            email: userData.email,
            street: userData.address.street,
            city: userData.address.city,
            country: userData.address.country,
            zipcode: userData.address.zipcode
        })

        expect(body).not.toHaveProperty('password')
    })
})
