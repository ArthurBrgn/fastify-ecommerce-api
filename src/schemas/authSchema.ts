import { userAddressSchema, userSchema } from '@/schemas/common/userSchema'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.email().meta({ example: 'user@example.com' }),
    password: z.string().meta({ example: 'Password123' })
})

const registerSchema = z
    .object({
        name: z.string().min(3).max(30).meta({ example: 'John Doe' }),
        email: z.email().meta({ example: 'john@example.com' }),
        password: z.string().min(6).max(100).meta({ example: 'Password123' }),
        password_confirm: z.string().min(6).max(100).meta({ example: 'Password123' }),
        address: userAddressSchema
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

type LoginRequest = z.infer<typeof loginSchema>
type LoginResponse = z.infer<typeof loginResponseSchema>

type RegisterRequest = z.infer<typeof registerSchema>
type RegisterResponse = z.infer<typeof registerResponseSchema>

export {
    LoginRequest,
    LoginResponse,
    loginResponseSchema,
    loginSchema,
    RegisterRequest,
    RegisterResponse,
    registerResponseSchema,
    registerSchema
}
