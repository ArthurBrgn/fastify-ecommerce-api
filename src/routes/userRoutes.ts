import { patchProfileHandler, profileHandler } from '@/controllers/userController'
import {
    UserProfilePatchRequest,
    userProfilePatchSchema,
    userProfileResponseSchema
} from '@/schemas/user/profileSchema'
import { FastifyInstance } from 'fastify'

export default function userRoutes(server: FastifyInstance) {
    server.get(
        '/me',
        {
            onRequest: [server.authenticate],
            schema: { response: { 200: userProfileResponseSchema } }
        },
        profileHandler
    )

    server.patch<{ Body: UserProfilePatchRequest }>(
        '/me',
        {
            onRequest: [server.authenticate],
            schema: {
                body: userProfilePatchSchema,
                response: { 200: userProfileResponseSchema }
            }
        },
        patchProfileHandler
    )
}
