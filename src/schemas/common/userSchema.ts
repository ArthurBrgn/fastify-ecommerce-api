import z from 'zod'

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

export { userAddressSchema, userSchema }
