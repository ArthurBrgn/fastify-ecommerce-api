import { registerSchema } from '@/schemas/authSchema'
import { userAddressSchema, userSchema } from '@/schemas/common/userSchema'
import z from 'zod'

const userProfileResponseSchema = userSchema

const addressPatchSchema = userAddressSchema.partial()

const userProfilePatchSchema = registerSchema.partial().extend({
    address: addressPatchSchema.optional()
})

type UserProfileResponse = z.infer<typeof userProfileResponseSchema>
type UserProfilePatchRequest = z.infer<typeof userProfilePatchSchema>

export {
    UserProfilePatchRequest,
    userProfilePatchSchema,
    UserProfileResponse,
    userProfileResponseSchema
}
