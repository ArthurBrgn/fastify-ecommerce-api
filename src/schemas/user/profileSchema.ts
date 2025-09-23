import z from 'zod'
import { saveUserSchema, userAddressSchema, userSchema } from './../../schemas/common/userSchema.js'

const userProfileResponseSchema = userSchema

const addressPatchSchema = userAddressSchema.partial()

const userProfilePatchSchema = saveUserSchema
    .partial()
    .extend({
        address: addressPatchSchema.optional()
    })
    .refine(
        (data) => {
            if (data.password === undefined && data.password_confirm === undefined) return true

            return (
                typeof data.password === 'string' &&
                typeof data.password_confirm === 'string' &&
                data.password === data.password_confirm
            )
        },
        {
            message: 'Passwords must match',
            path: ['password_confirm']
        }
    )

type UserProfileResponse = z.infer<typeof userProfileResponseSchema>
type UserProfilePatchRequest = z.infer<typeof userProfilePatchSchema>

export {
    UserProfilePatchRequest,
    userProfilePatchSchema,
    UserProfileResponse,
    userProfileResponseSchema
}
