import { buildApp } from '@/app'
import { PaginatedProductsResponse } from '@/schemas/common/productSchema'
import {
    searchProductsSchema,
    type SearchProductsRequest
} from '@/schemas/product/searchProductsSchema'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resetDatabase } from './../utils/resetDatabase'

let server: FastifyInstance
let token: string

const searchProducts = (queryParams?: Partial<SearchProductsRequest>, authToken?: string) => {
    const validatedParams = searchProductsSchema.parse(queryParams || {})

    const request = supertest(server.server)
        .get('/api/products')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .query(validatedParams)

    return request.send()
}

beforeAll(async () => {
    server = await buildApp()
    await server.ready()

    await resetDatabase(server.prisma)

    const createdUser = await server.prisma.user.create({
        data: {
            name: 'Test User',
            email: 'products@example.com',
            password: await hash('password', 10),
            street: '123 Test St',
            city: 'TestCity',
            country: 'TestCountry',
            zipcode: '12345'
        }
    })

    const category = await server.prisma.category.create({
        data: {
            name: 'Category',
            slug: 'category'
        }
    })

    for (let i = 0; i < 20; i++) {
        await server.prisma.product.create({
            data: {
                name: `Product ${i}`,
                slug: `product-${i}`,
                description: null,
                price: Math.floor(Math.random() * 101),
                stock: Math.floor(Math.random() * 101),
                categoryId: category.id
            }
        })
    }

    token = await server.jwt.sign({ id: createdUser.id })
})

afterAll(async () => {
    await resetDatabase(server.prisma)
    await server.close()
})

describe('GET /api/products', () => {
    it('should return paginated products successfully with default params', async () => {
        const response = await searchProducts({}, token)

        const body: PaginatedProductsResponse = response.body

        expect(response.status).toBe(200)

        expect(body.meta).toMatchObject({
            page: 1,
            itemsPerPage: 10,
            total: 20,
            totalPages: 2
        })

        expect(Array.isArray(body.data)).toBe(true)
        expect(body.data.length).toBeLessThanOrEqual(body.meta.itemsPerPage)

        body.data.forEach((product) => {
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

            expect(product).toHaveProperty('categoryId')
            expect(typeof product.categoryId).toBe('number')

            expect(product).toHaveProperty('createdAt')
            expect(new Date(product.createdAt).toString()).not.toBe('Invalid Date')
        })
    })

    it('should return correct products for page 2', async () => {
        const response = await searchProducts({ page: 2 }, token)
        const body: PaginatedProductsResponse = response.body

        expect(response.status).toBe(200)
        expect(body.meta.page).toBe(2)
        expect(body.data.length).toBe(10)
    })

    it('should filter products by search term', async () => {
        const response = await searchProducts({ search: 'Product 1' }, token)
        const body: PaginatedProductsResponse = response.body

        expect(response.status).toBe(200)
        expect(
            body.data.every(
                (p) =>
                    p.name.includes('Product 1') ||
                    (p.description && p.description.includes('Product 1'))
            )
        ).toBe(true)
    })

    it('should filter products by inStock', async () => {
        const response = await searchProducts({ inStock: true }, token)
        const body: PaginatedProductsResponse = response.body

        expect(response.status).toBe(200)
        expect(body.data.every((p) => p.stock > 0)).toBe(true)
    })

    it('should filter by minPrice', async () => {
        const minPrice = 50
        const response = await searchProducts({ minPrice }, token)
        const body: PaginatedProductsResponse = response.body

        expect(response.status).toBe(200)
        expect(body.data.every((p) => p.price >= minPrice)).toBe(true)
    })

    it('should filter by maxPrice', async () => {
        const maxPrice = 50
        const response = await searchProducts({ maxPrice }, token)
        const body: PaginatedProductsResponse = response.body

        expect(response.status).toBe(200)
        expect(body.data.every((p) => p.price <= maxPrice)).toBe(true)
    })

    it('should filter by minPrice and maxPrice together', async () => {
        const minPrice = 20
        const maxPrice = 40
        const response = await searchProducts({ minPrice, maxPrice }, token)
        const body: PaginatedProductsResponse = response.body

        expect(response.status).toBe(200)
        expect(body.data.every((p) => p.price >= minPrice && p.price <= maxPrice)).toBe(true)
    })

    it('should return 401 if token is not present', async () => {
        const { status, body } = await searchProducts()

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })

    it('should return 401 if token is invalid', async () => {
        const { status, body } = await searchProducts({}, 'Invalid token')

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })
})
