import { z } from 'zod'

const userSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.email(),
    street: z.string(),
    city: z.string(),
    zipcode: z.string(),
    country: z.string(),
    createdAt: z.date()
})

const loginSchema = z.object({
    email: z.email().meta({ example: 'user@example.com' }),
    password: z.string().meta({ example: 'Password123' })
})

const addressSchema = z.object({
    street: z.string().min(10).max(100).meta({ example: '123 Main Street' }),
    city: z
        .string()
        .regex(/^[^\d]+$/, 'City must not contain numbers')
        .min(3)
        .max(30)
        .meta({ example: 'Paris' }),
    country: z.string().min(3).max(30).meta({ example: 'France' }),
    zipcode: z
        .string()
        .regex(/^[A-Za-z0-9\s-]{3,10}$/)
        .meta({ example: '75001' })
})

const registerSchema = z
    .object({
        name: z.string().min(3).max(30).meta({ example: 'John Doe' }),
        email: z.email().meta({ example: 'john@example.com' }),
        password: z.string().min(6).max(100).meta({ example: 'Password123' }),
        password_confirm: z.string().min(6).max(100).meta({ example: 'Password123' }),
        address: addressSchema
    })
    .refine((data) => data.password === data.password_confirm, {
        message: 'Passwords must match',
        path: ['password_confirm']
    })

const loginResponseSchema = z.object({
    token: z.string()
})

const registerResponseSchema = z.object({
    token: z.string(),
    user: userSchema
})

const userProfileResponseSchema = userSchema

type LoginRequest = z.infer<typeof loginSchema>
type LoginResponse = z.infer<typeof loginResponseSchema>

type RegisterRequest = z.infer<typeof registerSchema>
type RegisterResponse = z.infer<typeof registerResponseSchema>

type UserProfileResponse = z.infer<typeof userProfileResponseSchema>

export {
    LoginRequest,
    LoginResponse,
    loginResponseSchema,
    loginSchema,
    RegisterRequest,
    RegisterResponse,
    registerResponseSchema,
    registerSchema,
    UserProfileResponse,
    userProfileResponseSchema
}
