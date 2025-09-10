import z from 'zod'

export default z.number().int().positive().meta({ example: 1 })
