import { z } from 'zod'
import { identifierSchema } from './identifierSchema.js'

const categorySchema = z.object({
    id: identifierSchema,
    name: z.string(),
    slug: z.string()
})

type Category = z.infer<typeof categorySchema>

export { Category, categorySchema }
