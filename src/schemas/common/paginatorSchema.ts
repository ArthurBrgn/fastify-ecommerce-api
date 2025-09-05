import { z } from 'zod'

export default z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    itemsPerPage: z.coerce.number().int().min(1).max(100).optional().default(10)
})
