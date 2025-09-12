import { buildApp } from '@/app'
import { LoginRequest } from '@/schemas/authSchema'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { resetDatabase } from './../utils/resetDatabase'

let server: FastifyInstance

const testEmail = 'login@example.com'
const testPassword = 'Password123'

beforeAll(async () => {
    server = await buildApp()
    await server.ready()
})

beforeEach(async () => {
    await resetDatabase(server.prisma)

    await server.prisma.user.create({
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
})

afterAll(async () => {
    await server.close()
})

describe('POST /api/login', () => {
    const postLogin = (payload: LoginRequest) =>
        supertest(server.server).post('/api/login').send(payload)

    it('should return 200 and a token for valid credentials', async () => {
        const { status, body } = await postLogin({ email: testEmail, password: testPassword })

        expect(status).toBe(200)

        expect(body).toHaveProperty('token')
        expect(typeof body.token).toBe('string')
    })

    it('should return 401 for invalid credentials', async () => {
        const { status, body } = await postLogin({
            email: 'fake@example.com',
            password: 'wrongpassword'
        })

        expect(status).toBe(401)

        expect(body).toHaveProperty('message', 'Invalid email or password')
    })

    it('should return 422 when email format is invalid', async () => {
        const { status, body } = await postLogin({ email: 'not-an-email', password: testPassword })

        expect(status).toBe(422)

        expect(body).toHaveProperty('errors')

        expect(body.errors).toBeInstanceOf(Array)
        expect(body.errors).toHaveLength(1)
        expect(body.errors[0]).toMatchObject({
            field: 'email',
            message: 'Invalid email address'
        })
    })
})
