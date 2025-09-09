import { saveUserSchema, userSchema } from '@/schemas/common/userSchema'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.email().meta({ example: 'user@example.com' }),
    password: z.string().meta({ example: 'Password123' })
})

const registerSchema = z
saveUserSchema.refine((data) => data.password === data.password_confirm, {
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
