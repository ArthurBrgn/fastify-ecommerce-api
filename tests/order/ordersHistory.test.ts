import { buildApp } from '@/app'
import { OrderResponse } from '@/schemas/order/orderSchema'
import { Category, Product, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resetDatabase } from './../utils/resetDatabase'

let server: FastifyInstance
let token: string
let category: Category
let product: Product
let user: Omit<User, 'password'>

const getOrdersHistory = (authToken?: string, query?: Record<string, unknown>) =>
    supertest(server.server)
        .get('/api/orders')
        .query(query ?? {})
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')

describe('GET /api/orders', () => {
    beforeAll(async () => {
        server = await buildApp()
        await server.ready()
        await resetDatabase(server.prisma)

        user = await server.prisma.user.create({
            data: {
                name: 'Test User',
                email: 'me@example.com',
                password: await hash('Password123', 10),
                street: '123 Test St',
                city: 'TestCity',
                country: 'TestCountry',
                zipcode: '12345'
            }
        })

        token = await server.jwt.sign({ id: user.id })

        category = await server.prisma.category.create({
            data: { name: 'Category', slug: 'category' }
        })

        product = await server.prisma.product.create({
            data: {
                name: 'Product',
                slug: 'product',
                description: 'Description',
                price: 10,
                stock: 100,
                categoryId: category.id
            }
        })

        // Seed 12 orders for pagination checks (default itemsPerPage = 10)
        for (let i = 0; i < 12; i++) {
            await server.prisma.order.create({
                data: {
                    userId: user.id,
                    total: 10,
                    orderItems: {
                        create: {
                            productId: product.id,
                            quantity: 1,
                            price: 10
                        }
                    }
                }
            })
        }
    })

    afterAll(async () => {
        await server.close()
    })

    it('should return orders history with formatted items and meta', async () => {
        const res = await getOrdersHistory(token)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('data')
        expect(Array.isArray(res.body.data)).toBe(true)

        const first: OrderResponse = res.body.data[0]
        expect(first).toHaveProperty('id')
        expect(first).toHaveProperty('total')
        expect(first).toHaveProperty('createdAt')
        expect(first.items).toBeInstanceOf(Array)
        expect(first.items[0]).toMatchObject({
            productId: product.id,
            quantity: 1,
            price: 10,
            total: 10
        })

        expect(res.body.data.length).toBe(10)
        expect(res.body).toHaveProperty('meta')
        expect(res.body.meta).toMatchObject({ page: 1, itemsPerPage: 10, total: 12, totalPages: 2 })
    })

    it('should return 401 if no token is provided', async () => {
        const res = await getOrdersHistory()
        expect(res.status).toBe(401)
    })

    it('should return 401 if token is invalid', async () => {
        const res = await getOrdersHistory('invalid-token')
        expect(res.status).toBe(401)
    })
})
