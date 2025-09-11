import z from 'zod'

export default z.int().positive().meta({ example: 1 })
