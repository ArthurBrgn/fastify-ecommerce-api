import { z } from 'zod'
import { saveUserSchema, userSchema } from './../schemas/common/userSchema'

const loginSchema = z.object({
    email: z.email().meta({ example: 'user@example.com' }),
    password: z.string().meta({ example: 'Password123' })
})

const registerSchema = saveUserSchema.refine((data) => data.password === data.password_confirm, {
    message: 'Passwords must match',
    path: ['password_confirm']
})

const loginResponseSchema = z.object({
    accessToken: z.string()
})

const refreshAccessTokenResponseSchema = loginResponseSchema

const registerResponseSchema = z.object({
    accessToken: z.string(),
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
    refreshAccessTokenResponseSchema,
    RegisterRequest,
    RegisterResponse,
    registerResponseSchema,
    registerSchema
}
