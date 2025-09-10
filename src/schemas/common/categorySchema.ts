import { z } from 'zod'
import modeldentifierSchema from './modeldentifierSchema'

export const categorySchema = z.object({
    id: modeldentifierSchema,
    name: z.string(),
    slug: z.string()
})

export type Category = z.infer<typeof categorySchema>
