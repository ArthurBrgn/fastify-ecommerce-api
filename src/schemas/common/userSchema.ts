import z from 'zod'
import { identifierSchema } from './identifierSchema'

const userSchema = z.object({
    id: identifierSchema,
    name: z.string(),
    email: z.email(),
    street: z.string(),
    city: z.string(),
    zipcode: z.string(),
    country: z.string(),
    createdAt: z.date()
})

const userAddressSchema = z.object({
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

const saveUserSchema = z.object({
    name: z.string().min(3).max(30).meta({ example: 'John Doe' }),
    email: z.email().meta({ example: 'john@example.com' }),
    password: z.string().min(6).max(100).meta({ example: 'Password123' }),
    password_confirm: z.string().min(6).max(100).meta({ example: 'Password123' }),
    address: userAddressSchema
})

export { saveUserSchema, userAddressSchema, userSchema }
