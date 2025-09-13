import { buildApp } from '@/app'
import { OrderResponse } from '@/schemas/order/orderSchema'
import { Category, Product, User } from '@prisma/client'
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

const createOrderRequest = (authToken?: string) =>
    supertest(server.server)
        .post('/api/orders')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .send()

beforeAll(async () => {
    server = await buildApp()
    await server.ready()
    await resetDatabase(server.prisma)

    // Create user
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
})

beforeEach(async () => {
    await server.prisma.cart.deleteMany({ where: { userId: user.id } })

    await server.prisma.cartItem.create({
        data: {
            cart: {
                connectOrCreate: {
                    where: { userId: user.id },
                    create: { userId: user.id }
                }
            },
            product: {
                connect: { id: product.id }
            },
            quantity: 2
        }
    })
})

afterAll(async () => {
    await resetDatabase(server.prisma)
    await server.close()
})

describe('POST /api/orders', () => {
    it('should create an order successfully', async () => {
        const { status, body } = await createOrderRequest(token)

        expect(status).toBe(201)
        expect(body).toHaveProperty('id')
        expect(body).toHaveProperty('total', 20)
        expect(body.items).toHaveLength(1)
        expect(body.items[0]).toMatchObject({
            productId: product.id,
            quantity: 2,
            price: 10,
            total: 20
        })

        const updatedProduct = await server.prisma.product.findUnique({ where: { id: product.id } })
        expect(updatedProduct?.stock).toBe(3)

        const cart = await server.prisma.cart.findUnique({ where: { userId: user.id } })
        expect(cart).toBeNull()
    })

    it('should return 404 if cart does not exists', async () => {
        await server.prisma.cart.deleteMany({ where: { userId: user.id } })
        const { status, body } = await createOrderRequest(token)
        expect(status).toBe(404)
        expect(body).toHaveProperty('message', 'Cart not found')
    })

    it('should return 409 if requested quantity exceeds stock', async () => {
        const cart = await server.prisma.cart.findUnique({ where: { userId: user.id } })

        await server.prisma.cartItem.updateMany({
            where: {
                cartId: cart?.id
            },
            data: { quantity: 999 }
        })

        const { status, body } = await createOrderRequest(token)
        expect(status).toBe(409)
        expect(body.message).toContain(`Product ${product.id} is out of stock`)
    })

    it('should return 401 if token is missing', async () => {
        const { status, body } = await createOrderRequest()
        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })

    it('should return 401 if token is invalid', async () => {
        const { status, body } = await createOrderRequest('invalidtoken')
        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })

    it('should handle multiple items correctly', async () => {
        const secondProduct = await server.prisma.product.create({
            data: {
                name: 'Product 2',
                slug: 'product-2',
                description: 'Description 2',
                price: 50,
                stock: 10,
                categoryId: category.id
            }
        })

        // Add second product to cart
        await server.prisma.cartItem.create({
            data: {
                cart: {
                    connectOrCreate: {
                        where: { userId: user.id },
                        create: { userId: user.id }
                    }
                },
                product: {
                    connect: { id: secondProduct.id }
                },
                quantity: 2
            }
        })

        const response = await createOrderRequest(token)

        const body: OrderResponse = response.body

        expect(response.status).toBe(201)
        expect(body.total).toBe(120)
        expect(body.items).toHaveLength(2)
        expect(body.items.find((i) => i.productId === product.id)?.total).toBe(20)
        expect(body.items.find((i) => i.productId === secondProduct.id)?.total).toBe(100)
    })
})
