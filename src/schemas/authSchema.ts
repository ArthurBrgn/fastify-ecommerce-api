import { z } from 'zod'

const loginSchema = z.object({
    email: z.email(),
    password: z.string(),
})

const addressSchema = z.object({
    street: z.string().min(10).max(100),
    city: z
        .string()
        .regex(/^[^\d]+$/, 'City must not contain numbers')
        .min(3)
        .max(30),
    country: z.string().min(3).max(30),
    zipcode: z.string().regex(/^[A-Za-z0-9\s-]{3,10}$/),
})

const registerSchema = z
    .object({
        name: z.string().min(3).max(30),
        email: z.email(),
        password: z.string().min(6).max(100),
        password_confirm: z.string().min(6).max(100),
        address: addressSchema,
    })
    .refine((data) => data.password === data.password_confirm, {
        message: 'Passwords must match',
        path: ['password_confirm', 'password'],
    })

const loginResponseSchema = z.object({
    token: z.string(),
})

type LoginRequest = z.infer<typeof loginSchema>
type LoginResponse = z.infer<typeof loginResponseSchema>
type RegisterRequest = z.infer<typeof registerSchema>

export {
    loginSchema,
    loginResponseSchema,
    LoginRequest,
    LoginResponse,
    registerSchema,
    RegisterRequest,
}
