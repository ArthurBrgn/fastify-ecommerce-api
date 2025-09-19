import { buildApp } from '@/app'
import { Coupon, Product } from '@prisma/client'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import supertest from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resetDatabase } from './../utils/resetDatabase'

let server: FastifyInstance
let token: string
let product: Product
let coupon: Coupon

const addCouponToCart = (couponCode: string, authToken?: string) =>
    supertest(server.server)
        .post('/api/cart/coupon')
        .set('Authorization', authToken ? `Bearer ${authToken}` : '')
        .send({ couponCode })

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

    const category = await server.prisma.category.create({
        data: { name: 'Category', slug: 'category' }
    })

    product = await server.prisma.product.create({
        data: {
            name: 'Product',
            slug: 'product',
            description: 'Description',
            price: 100,
            stock: 10,
            categoryId: category.id
        }
    })

    coupon = await server.prisma.coupon.create({
        data: {
            code: 'SAVE20',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
    })

    const cart = await server.prisma.cart.create({
        data: { userId: user.id }
    })

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

describe('POST /api/cart/coupon', () => {
    it('should add a coupon to the cart successfully and apply discount', async () => {
        const { status, body } = await addCouponToCart(coupon.code, token)

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
            total: 200
        })

        expect(body.total).toBe(160)
    })

    it('should return 409 if coupon is already present in cart', async () => {
        const { status, body } = await addCouponToCart(coupon.code, token)

        expect(status).toBe(409)
        expect(body).toHaveProperty('message', 'Cannot add multiple coupons')
    })

    it('should return 404 if coupon does not exist', async () => {
        const testUser = await server.prisma.user.create({
            data: {
                name: 'Test user',
                email: 'couponnotexists@example.com',
                password: await hash('Password123', 10),
                street: '123 Test St',
                city: 'TestCity',
                country: 'TestCountry',
                zipcode: '12345'
            }
        })

        const userToken = await server.jwt.sign({ id: testUser.id })

        await server.prisma.cart.create({
            data: { userId: testUser.id }
        })

        const { status, body } = await addCouponToCart('INVALID_COUPON', userToken)

        expect(status).toBe(404)
        expect(body).toHaveProperty('message', 'Coupon not found or expired')
    })

    it('should return 404 if coupon is expired', async () => {
        const testUser = await server.prisma.user.create({
            data: {
                name: 'Test user',
                email: 'couponexpired@example.com',
                password: await hash('Password123', 10),
                street: '123 Test St',
                city: 'TestCity',
                country: 'TestCountry',
                zipcode: '12345'
            }
        })

        const userToken = await server.jwt.sign({ id: testUser.id })

        await server.prisma.cart.create({
            data: { userId: testUser.id }
        })

        const expiredCoupon = await server.prisma.coupon.create({
            data: {
                code: 'EXPIRED',
                discountType: 'FIXED',
                discountValue: 10,
                expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
            }
        })

        const { status, body } = await addCouponToCart(expiredCoupon.code, userToken)

        expect(status).toBe(404)
        expect(body).toHaveProperty('message', 'Coupon not found or expired')
    })

    it('should return 404 if cart does not exist', async () => {
        const userWithoutCart = await server.prisma.user.create({
            data: {
                name: 'User Without Cart',
                email: 'nocart@example.com',
                password: await hash('Password123', 10),
                street: '123 Test St',
                city: 'TestCity',
                country: 'TestCountry',
                zipcode: '12345'
            }
        })

        const userToken = await server.jwt.sign({ id: userWithoutCart.id })

        const { status, body } = await addCouponToCart(coupon.code, userToken)

        expect(status).toBe(404)
        expect(body).toHaveProperty('message', 'Cart not found')
    })

    it('should test fixed amount coupon discount', async () => {
        const testUser = await server.prisma.user.create({
            data: {
                name: 'Test User Fixed',
                email: 'fixed@example.com',
                password: await hash('Password123', 10),
                street: '123 Test St',
                city: 'TestCity',
                country: 'TestCountry',
                zipcode: '12345'
            }
        })

        const testToken = await server.jwt.sign({ id: testUser.id })

        const testCart = await server.prisma.cart.create({
            data: { userId: testUser.id }
        })

        await server.prisma.cartItem.create({
            data: {
                cartId: testCart.id,
                productId: product.id,
                quantity: 1
            }
        })

        const fixedCoupon = await server.prisma.coupon.create({
            data: {
                code: 'SAVE10',
                discountType: 'FIXED',
                discountValue: 10,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        })

        const { status, body } = await addCouponToCart(fixedCoupon.code, testToken)

        expect(status).toBe(200)
        expect(body.items[0].total).toBe(100)
        expect(body.total).toBe(90)
    })

    it('should return 401 if token is not present', async () => {
        const { status, body } = await addCouponToCart(coupon.code)

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })

    it('should return 401 if token is invalid', async () => {
        const { status, body } = await addCouponToCart(coupon.code, 'Invalid token')

        expect(status).toBe(401)
        expect(body).toHaveProperty('message')
    })
})
