import z from 'zod'

const identifierSchema = z.int().positive().meta({ example: 1 })

const identifierParamSchema = z.object({
    id: z.coerce.number().int().positive().meta({ example: 1 })
})

export { identifierParamSchema, identifierSchema }
