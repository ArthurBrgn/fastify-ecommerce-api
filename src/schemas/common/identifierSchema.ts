import z from 'zod'

const identifierSchema = z.int().positive().meta({ example: 1 })

const identifierParamSchema = z.object({
    id: z.coerce.number().pipe(identifierSchema)
})

type IdentifierParamsSchema = z.infer<typeof identifierParamSchema>

export { IdentifierParamsSchema, identifierParamSchema, identifierSchema }
