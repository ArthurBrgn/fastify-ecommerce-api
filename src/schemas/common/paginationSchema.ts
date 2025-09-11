import { z } from 'zod'

const paginationRequestSchema = z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    itemsPerPage: z.coerce.number().int().min(1).max(100).optional().default(10)
})

const paginationMetaSchema = z.object({
    page: z.int().meta({ example: 1 }),
    itemsPerPage: z.int().meta({ example: 10 }),
    total: z.int().meta({ example: 30 }),
    totalPages: z.int().meta({ example: 5 })
})

export { paginationMetaSchema, paginationRequestSchema }
