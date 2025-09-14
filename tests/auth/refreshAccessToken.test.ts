import { buildApp } from '@/app'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { resetDatabase } from './../utils/resetDatabase'

let server: FastifyInstance
let refreshToken: string

beforeAll(async () => {
    server = await buildApp()
    await server.ready()
})

beforeEach(async () => {
    await resetDatabase(server.prisma)

    const user = await server.prisma.user.create({
        data: {
            name: 'Test User',
            email: 'user@example.com',
            password: await hash('Password123', 10),
            street: '123 Test St',
            city: 'TestCity',
            country: 'TestCountry',
            zipcode: '12345'
        }
    })

    refreshToken = await server.jwt.sign({ id: user.id }, { expiresIn: '7d' })
})

afterAll(async () => {
    await server.close()
})

describe('GET /api/auth/refresh', () => {
    const refreshAccessToken = (token?: string) => {
        const req = supertest(server.server).get('/api/auth/refresh')

        if (token) {
            req.set('Cookie', `refreshToken=${token}`)
        }

        return req.send()
    }

    it('should return 200 and access token', async () => {
        const response = await refreshAccessToken(refreshToken)

        expect(response.status).toBe(200)

        expect(response.body).toHaveProperty('accessToken')
        expect(typeof response.body.accessToken).toBe('string')
    })

    it('should return 401 when refreshToken is missing', async () => {
        const response = await refreshAccessToken()

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', 'Unauthorized action')
    })

    it('should return 401 when refreshToken is invalid', async () => {
        const response = await refreshAccessToken('invalidtoken')

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('message', 'Unauthorized action')
    })
})
