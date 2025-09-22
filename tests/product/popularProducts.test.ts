import { buildApp } from '@/app'
import { PopularProductsResponse } from '@/schemas/product/popularProductsSchema'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resetDatabase } from '../utils/resetDatabase'

let server: FastifyInstance
let token: string
let categoryId: number
const productIds: number[] = []

const getPopularProducts = (authToken?: string) => {
    const request = supertest(server.server)
        .get('/api/products/popular')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')

    return request.send()
}

beforeAll(async () => {
    server = await buildApp()
    await server.ready()

    await resetDatabase(server.prisma)

    const createdUser = await server.prisma.user.create({
        data: {
            name: 'Test User',
            email: 'popularProducts@example.com',
            password: await hash('password', 10),
            street: '123 Test St',
            city: 'TestCity',
            country: 'TestCountry',
            zipcode: '12345'
        }
    })

    const category = await server.prisma.category.create({
        data: {
            name: 'Electronics',
            slug: 'electronics'
        }
    })
    categoryId = category.id

    const products = []

    for (let i = 1; i <= 5; i++) {
        const product = await server.prisma.product.create({
            data: {
                name: `Product ${i}`,
                slug: `product-${i}`,
                description: `Description for product ${i}`,
                price: 100 * i,
                stock: 50,
                categoryId: category.id
            }
        })
        products.push(product)
        productIds.push(product.id)
    }

    const order1 = await server.prisma.order.create({
        data: {
            userId: createdUser.id,
            total: 1500
        }
    })

    const order2 = await server.prisma.order.create({
        data: {
            userId: createdUser.id,
            total: 1000
        }
    })

    const order3 = await server.prisma.order.create({
        data: {
            userId: createdUser.id,
            total: 500
        }
    })

    await server.prisma.orderItem.createMany({
        data: [
            { orderId: order1.id, productId: productIds[0], quantity: 5, price: 100 },
            { orderId: order2.id, productId: productIds[0], quantity: 5, price: 100 },
            { orderId: order3.id, productId: productIds[0], quantity: 5, price: 100 }
        ]
    })

    await server.prisma.orderItem.createMany({
        data: [
            { orderId: order1.id, productId: productIds[1], quantity: 5, price: 200 },
            { orderId: order2.id, productId: productIds[1], quantity: 5, price: 200 }
        ]
    })

    await server.prisma.orderItem.createMany({
        data: [
            { orderId: order1.id, productId: productIds[4], quantity: 3, price: 500 },
            { orderId: order2.id, productId: productIds[4], quantity: 5, price: 500 }
        ]
    })

    await server.prisma.orderItem.create({
        data: {
            orderId: order3.id,
            productId: productIds[2],
            quantity: 5,
            price: 300
        }
    })

    token = await server.jwt.sign({ id: createdUser.id })
})

afterAll(async () => {
    await resetDatabase(server.prisma)
    await server.close()
})

describe('GET /api/products/popular', () => {
    it('should return popular products ordered by quantity sold', async () => {
        const response = await getPopularProducts(token)

        expect(response.status).toBe(200)

        const body: PopularProductsResponse = response.body

        expect(Array.isArray(body)).toBe(true)
        expect(body.length).toBe(4)

        body.forEach((product) => {
            expect(product).toHaveProperty('id')
            expect(typeof product.id).toBe('number')

            expect(product).toHaveProperty('name')
            expect(typeof product.name).toBe('string')

            expect(product).toHaveProperty('slug')
            expect(typeof product.slug).toBe('string')

            expect(product).toHaveProperty('description')
            expect(product.description === null || typeof product.description === 'string').toBe(
                true
            )

            expect(product).toHaveProperty('price')
            expect(typeof product.price).toBe('number')

            expect(product).toHaveProperty('stock')
            expect(typeof product.stock).toBe('number')

            expect(product).toHaveProperty('createdAt')
            expect(new Date(product.createdAt).toString()).not.toBe('Invalid Date')

            expect(product).toHaveProperty('category')
            expect(product.category).toMatchObject({
                id: categoryId,
                name: 'Electronics',
                slug: 'electronics'
            })
        })

        expect(body[0].id).toBe(productIds[0])
        expect(body[1].id).toBe(productIds[1])
        expect(body[2].id).toBe(productIds[4])
        expect(body[3].id).toBe(productIds[2])

        expect(body.find((p) => p.id === productIds[3])).toBeUndefined()
    })

    it('should return empty array when no products have been sold', async () => {
        const testServer = await buildApp()
        await testServer.ready()

        const testUser = await testServer.prisma.user.create({
            data: {
                name: 'Test User 2',
                email: 'popularproductsempty@example.com',
                password: await hash('password', 10),
                street: '123 Test St',
                city: 'TestCity',
                country: 'TestCountry',
                zipcode: '12345'
            }
        })

        const testCategory = await testServer.prisma.category.create({
            data: {
                name: 'Books',
                slug: 'books'
            }
        })

        await testServer.prisma.product.createMany({
            data: [
                {
                    name: 'Book 1',
                    slug: 'book-1',
                    description: 'A great book',
                    price: 20,
                    stock: 10,
                    categoryId: testCategory.id
                },
                {
                    name: 'Book 2',
                    slug: 'book-2',
                    description: 'Another great book',
                    price: 25,
                    stock: 15,
                    categoryId: testCategory.id
                }
            ]
        })

        const testToken = await testServer.jwt.sign({ id: testUser.id })

        const response = await supertest(testServer.server)
            .get('/api/products/popular')
            .set('Authorization', `Bearer ${testToken}`)

        expect(response.status).toBe(200)
        expect(response.body).toEqual([])

        await resetDatabase(testServer.prisma)
        await testServer.close()
    })

    it('should return 401 if token is not present', async () => {
        const { status, body } = await getPopularProducts()

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })

    it('should return 401 if token is invalid', async () => {
        const { status, body } = await getPopularProducts('Invalid token')

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })
})
