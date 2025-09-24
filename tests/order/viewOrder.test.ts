import { buildApp } from '@/app'
import { Category, Order, Product, User } from '@/generated/prisma/client'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { resetDatabase } from './../utils/resetDatabase'

let server: FastifyInstance
let token: string
let category: Category
let product: Product
let user: Omit<User, 'password'>
let order: Order

const getOrder = (id: number, authToken?: string) =>
    supertest(server.server)
        .get(`/api/orders/${id}`)
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')

describe('GET /api/orders/:id', () => {
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
                price: 9.99,
                stock: 50,
                categoryId: category.id
            }
        })
    })

    beforeEach(async () => {
        await server.prisma.order.deleteMany({ where: { userId: user.id } })

        order = await server.prisma.order.create({
            data: {
                userId: user.id,
                total: 19.98,
                orderItems: {
                    create: {
                        productId: product.id,
                        quantity: 2,
                        price: 9.99
                    }
                }
            }
        })
    })

    afterAll(async () => {
        await server.close()
    })

    it('should return order details successfully', async () => {
        const res = await getOrder(order.id, token)

        expect(res.status).toBe(200)
        expect(res.body.id).toBe(order.id)
        expect(res.body.items).toHaveLength(1)
        expect(res.body.items[0].productId).toBe(product.id)
    })

    it('should return 404 if order does not exist', async () => {
        const res = await getOrder(999, token)

        expect(res.status).toBe(404)
    })

    it('should return 401 if no token is provided', async () => {
        const res = await getOrder(order.id)

        expect(res.status).toBe(401)
    })

    it('should return 401 if token is invalid', async () => {
        const res = await getOrder(order.id, 'Invalid token')

        expect(res.status).toBe(401)
    })
})
