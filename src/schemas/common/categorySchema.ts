import { z } from 'zod'
import modelIdentifierSchema from './modelIdentifierSchema'

const categorySchema = z.object({
    id: modelIdentifierSchema,
    name: z.string(),
    slug: z.string()
})

type Category = z.infer<typeof categorySchema>

export { Category, categorySchema }
