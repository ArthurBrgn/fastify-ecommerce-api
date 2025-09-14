import { buildApp } from '@/app'
import type { RegisterRequest } from '@/schemas/authSchema'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { resetDatabase } from '../utils/resetDatabase'

let server: FastifyInstance

const testPassword = 'Password123'

const userData: RegisterRequest = {
    name: 'Test User',
    email: 'test@example.com',
    password: testPassword,
    password_confirm: testPassword,
    address: {
        street: '123 Test St',
        city: 'TestCity',
        country: 'TestCountry',
        zipcode: '12345'
    }
}

const postRegister = (payload: RegisterRequest) =>
    supertest(server.server).post('/api/auth/register').send(payload)

beforeAll(async () => {
    server = await buildApp()
    await server.ready()
})

beforeEach(async () => {
    await resetDatabase(server.prisma)
})

afterAll(async () => {
    await server.close()
})

describe('POST /api/auth/register', () => {
    it('should success and return user data and token', async () => {
        const response = await postRegister(userData)

        const { status, body } = response

        expect(status).toBe(201)

        expect(body).toHaveProperty('accessToken')
        expect(body).toHaveProperty('user')

        expect(typeof body.accessToken).toBe('string')

        expect(body.user).toMatchObject({
            id: expect.any(Number),
            name: userData.name,
            email: userData.email,
            street: userData.address.street,
            city: userData.address.city,
            country: userData.address.country,
            zipcode: userData.address.zipcode
        })

        expect(body.user).not.toHaveProperty('password')

        const cookies = ([] as string[]).concat(response.headers['set-cookie'] || [])

        expect(cookies).toBeDefined()
        expect(cookies.some((c: string) => c.startsWith('refreshToken='))).toBe(true)
    })

    it('should return 409 if email already exists', async () => {
        await server.prisma.user.create({
            data: {
                name: 'Existing User',
                email: userData.email,
                password: await hash(testPassword, 10),
                ...userData.address
            }
        })

        const { status, body } = await postRegister(userData)

        expect(status).toBe(409)

        expect(body).toHaveProperty('message', 'Email already in use')
    })

    it('should return 422 for invalid data', async () => {
        const invalidData: RegisterRequest = {
            ...userData,
            email: 'not-an-email',
            name: 'A',
            address: { ...userData.address, city: 'City123', zipcode: '1' }
        }

        const { status, body } = await postRegister(invalidData)

        expect(status).toBe(422)

        expect(body.errors).toBeInstanceOf(Array)
        expect(body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ field: 'email', message: 'Invalid email address' }),
                expect.objectContaining({ field: 'name', message: expect.any(String) }),
                expect.objectContaining({
                    field: 'address.city',
                    message: 'City must not contain numbers'
                }),
                expect.objectContaining({ field: 'address.zipcode', message: expect.any(String) })
            ])
        )
    })

    it('should return 422 when password and password_confirm do not match', async () => {
        const mismatchData: RegisterRequest = {
            ...userData,
            password_confirm: 'DifferentPassword'
        }

        const { status, body } = await postRegister(mismatchData)

        expect(status).toBe(422)

        expect(body.errors).toBeInstanceOf(Array)
        expect(body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'password_confirm',
                    message: 'Passwords must match'
                })
            ])
        )
    })
})
