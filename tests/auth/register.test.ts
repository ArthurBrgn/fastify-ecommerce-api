import { it, beforeAll, beforeEach, afterAll, expect, describe } from 'vitest'
import supertest from 'supertest'
import { buildApp } from '../../src/app'
import { hash } from 'bcryptjs'
import { resetDatabase } from '../utils/resetDatabase'
import type { RegisterRequest, RegisterResponse } from '../../src/schemas/authSchema'

describe('POST /api/register', () => {
    let server

    const password = 'Password123'

    const userData: RegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: password,
        password_confirm: password,
        address: {
            street: '123 Test St',
            city: 'TestCity',
            country: 'TestCountry',
            zipcode: '12345'
        }
    }

    const postRegister = (payload: RegisterRequest) =>
        supertest(server.server).post('/api/register').send(payload)

    beforeAll(async () => {
        server = buildApp()
        await server.ready()
    })

    beforeEach(async () => {
        await resetDatabase(server.prisma)
    })

    afterAll(async () => {
        await server.close()
    })

    it('should return 201 and user data for successful registration', async () => {
        const response = await postRegister(userData)

        const body: RegisterResponse = response.body

        expect(response.status).toBe(201)
        expect(body).toHaveProperty('token')
        expect(typeof body.token).toBe('string')

        expect(body).toHaveProperty('user')
        const { user } = body
        expect(user).toMatchObject({
            name: userData.name,
            email: userData.email,
            street: userData.address.street,
            city: userData.address.city,
            country: userData.address.country,
            zipcode: userData.address.zipcode
        })
        expect(user).not.toHaveProperty('password')
    })

    it('should return 409 if email already exists', async () => {
        await server.prisma.user.create({
            data: {
                name: 'Existing User',
                email: userData.email,
                password: await hash(password, 10),
                ...userData.address
            }
        })

        const response = await postRegister(userData)

        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('message', 'Email already in use')
    })

    it('should return 422 for invalid data', async () => {
        const invalidData: RegisterRequest = {
            ...userData,
            email: 'not-an-email',
            name: 'A',
            address: { ...userData.address, city: 'City123', zipcode: '1' }
        }

        const response = await postRegister(invalidData)

        expect(response.status).toBe(422)
        expect(response.body.errors).toBeInstanceOf(Array)
        expect(response.body.errors).toEqual(
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

        const response = await postRegister(mismatchData)

        expect(response.status).toBe(422)
        expect(response.body.errors).toBeInstanceOf(Array)
        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: 'password_confirm',
                    message: 'Passwords must match'
                })
            ])
        )
    })
})
