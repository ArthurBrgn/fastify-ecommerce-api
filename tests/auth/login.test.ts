import { it, beforeAll, beforeEach, afterAll, expect, describe } from 'vitest'
import supertest from 'supertest'
import { buildApp } from '../../src/app'
import { hash } from 'bcryptjs'
import { resetDatabase } from '../utils/resetDatabase'
import { LoginRequest } from '../../src/schemas/authSchema'

describe('POST /api/login', () => {
    let server

    const testEmail = 'login@example.com'
    const testPassword = 'Password123'

    const postLogin = (payload: LoginRequest) =>
        supertest(server.server).post('/api/login').send(payload)

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

    it('should return 200 and a token for valid credentials', async () => {
        const response = await postLogin({ email: testEmail, password: testPassword })

        const { status, body } = response

        expect(status).toBe(200)
        expect(body).toHaveProperty('token')
        expect(typeof body.token).toBe('string')
    })

    it('should return 401 for invalid credentials', async () => {
        const response = await postLogin({ email: 'fake@example.com', password: 'wrongpassword' })

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', 'Invalid email or password')
    })

    it('should return 422 when email format is invalid', async () => {
        const response = await postLogin({ email: 'not-an-email', password: testPassword })

        const { status, body } = response

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
