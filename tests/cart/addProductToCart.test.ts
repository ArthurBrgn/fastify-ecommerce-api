import { buildApp } from '@/app'
import { Category, Product } from '@/generated/prisma/client'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resetDatabase } from './../utils/resetDatabase'

let server: FastifyInstance
let token: string
let category: Category
let product: Product

const addToCart = (productId: number, quantity: number, authToken?: string) =>
    supertest(server.server)
        .post('/api/cart/items')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .send({ productId, quantity })

beforeAll(async () => {
    server = await buildApp()
    await server.ready()

    await resetDatabase(server.prisma)

    const user = await server.prisma.user.create({
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

    category = await server.prisma.category.create({
        data: { name: 'Category', slug: 'category' }
    })

    product = await server.prisma.product.create({
        data: {
            name: 'Product',
            slug: 'product',
            description: 'Description',
            price: 10,
            stock: 5,
            categoryId: category.id
        }
    })

    token = await server.jwt.sign({ id: user.id })
})

afterAll(async () => {
    await resetDatabase(server.prisma)
    await server.close()
})

describe('POST /api/cart/items', () => {
    it('should add a product to the cart successfully', async () => {
        const { status, body } = await addToCart(product.id, 2, token)

        expect(status).toBe(200)
        expect(body.items).toHaveLength(1)
        expect(body.items[0]).toMatchObject({
            product: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price
            },
            quantity: 2,
            total: 20
        })
        expect(body.total).toBe(20)
    })

    it('should increment quantity if product already in cart', async () => {
        const { status, body } = await addToCart(product.id, 1, token)

        expect(status).toBe(200)
        expect(body.items[0].quantity).toBe(3)
        expect(body.total).toBe(30)
    })

    it('should return 404 if product does not exist', async () => {
        const { status, body } = await addToCart(99999, 1, token)

        expect(status).toBe(404)
        expect(body).toHaveProperty('message', 'Product not found')
    })

    it('should return 400 if requested quantity exceeds stock', async () => {
        const { status, body } = await addToCart(product.id, 999, token)

        expect(status).toBe(409)
        expect(body).toHaveProperty('message')
        expect(body.message).toContain(
            `Requested quantity exceeds available stock. Available stock: ${product.stock}.`
        )
    })

    it('should return 401 if token is not present', async () => {
        const { status, body } = await addToCart(product.id, 1)

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })

    it('should return 401 if token is invalid', async () => {
        const { status, body } = await addToCart(product.id, 1, 'Invalid token')

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })
})
