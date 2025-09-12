import { buildApp } from '@/app'
import { Category, Product } from '@prisma/client'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resetDatabase } from './../utils/resetDatabase'

let server: FastifyInstance
let token: string

let category: Category
let product: Product
let cartId: number

const incrementCartItemQuantity = (productId: number, authToken?: string) =>
    supertest(server.server)
        .patch(`/api/cart/items/${productId}/increment`)
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')

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
            stock: 5,
            categoryId: category.id
        }
    })

    const cart = await server.prisma.cart.create({
        data: { userId: user.id }
    })

    cartId = cart.id

    await server.prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId: product.id,
            quantity: 2
        }
    })
})

afterAll(async () => {
    await resetDatabase(server.prisma)
    await server.close()
})

describe('PATCH /api/cart/items/:productId/increment', () => {
    it('should increment the quantity of a product in the cart', async () => {
        const { status, body } = await incrementCartItemQuantity(product.id, token)

        expect(status).toBe(200)
        
        expect(body.items).toHaveLength(1)
        expect(body.items[0]).toMatchObject({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            quantity: 3,
            total: 30
        })

        expect(body.total).toBe(30)
    })

    it('should return 404 if product not in cart', async () => {
        const { status, body } = await incrementCartItemQuantity(99999, token)

        expect(status).toBe(404)
        expect(body).toHaveProperty('message', 'Product not in cart')
    })

    it('should return 409 if stock is exceeded', async () => {
        await server.prisma.cartItem.update({
            where: { cartId_productId: { cartId, productId: product.id } },
            data: { quantity: 5 }
        })

        const { status, body } = await incrementCartItemQuantity(product.id, token)

        expect(status).toBe(409)
        expect(body.message).toContain('Not enough stock')
    })

    it('should return 401 if token is missing', async () => {
        const { status, body } = await incrementCartItemQuantity(product.id)

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })

    it('should return 401 if token is invalid', async () => {
        const { status, body } = await incrementCartItemQuantity(product.id, 'Invalid token')

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })
})
