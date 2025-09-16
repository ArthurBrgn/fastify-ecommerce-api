import { buildApp } from '@/app'
import { Category, Product, User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resetDatabase } from './../utils/resetDatabase'

let server: FastifyInstance
let token: string
let user: Omit<User, 'password'>
let category: Category
let product: Product
let cartId: number

const deleteCart = (id: number, authToken?: string) =>
    supertest(server.server)
        .delete(`/api/cart/${id}`)
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')

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

describe('DELETE /api/cart/:id', () => {
    it('should delete the entire cart and return 204', async () => {
        const { status, body } = await deleteCart(cartId, token)

        expect(status).toBe(204)
        expect(body).toEqual({})

        const cart = await server.prisma.cart.findUnique({ where: { id: cartId } })
        expect(cart).toBeNull()

        const items = await server.prisma.cartItem.findMany({ where: { cartId } })
        expect(items).toHaveLength(0)
    })

    it('should return 404 if cart does not exist', async () => {
        const { status, body } = await deleteCart(999999, token)

        expect(status).toBe(404)
        expect(body).toHaveProperty('message', 'Cart not found')
    })

    it('should return 401 if token is missing', async () => {
        const { status, body } = await deleteCart(cartId)

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })

    it('should return 401 if token is invalid', async () => {
        const { status, body } = await deleteCart(cartId, 'Invalid token')

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })
})
