import { buildApp } from '@/app'
import { ViewProductResponse } from '@/schemas/product/viewProductSchema'
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

const testEmail = 'me@example.com'
const testPassword = 'Password123'

const getProduct = (id: number, authToken?: string) =>
    supertest(server.server)
        .get(`/api/products/${id}`)
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')

beforeAll(async () => {
    server = await buildApp()
    await server.ready()

    await resetDatabase(server.prisma)

    const user = await server.prisma.user.create({
        data: {
            name: 'Test User',
            email: testEmail,
            password: await hash(testPassword, 10),
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

describe('GET /api/products/:id', () => {
    it('should return product details successfully', async () => {
        const response = await getProduct(product.id, token)

        const body: ViewProductResponse = response.body

        expect(response.status).toBe(200)

        expect(body).toMatchObject({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: expect.objectContaining({
                id: category.id,
                name: category.name,
                slug: category.slug
            })
        })

        expect(new Date(body.createdAt).toString()).not.toBe('Invalid Date')
    })

    it('should return 404 if product does not exist', async () => {
        const { status } = await getProduct(99999, token)

        expect(status).toBe(404)
    })

    it('should return 401 if token is not present', async () => {
        const { status, body } = await getProduct(product.id)

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })

    it('should return 401 if token is invalid', async () => {
        const { status, body } = await getProduct(product.id, 'Invalid token')

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })
})
