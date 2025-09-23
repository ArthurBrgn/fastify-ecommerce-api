import { FastifyReply, FastifyRequest } from 'fastify'
import { UserProfilePatchRequest } from './../schemas/user/profileSchema'
import { getUserInfoById, patchUserInfo } from './../services/userService'

export async function profileHandler(request: FastifyRequest, reply: FastifyReply) {
    const user = await getUserInfoById(request.server.prisma, request.user.id)

    return reply.send(user)
}

export async function patchProfileHandler(
    request: FastifyRequest<{ Body: UserProfilePatchRequest }>,
    reply: FastifyReply
) {
    const user = await patchUserInfo(request.server.prisma, request.user.id, request.body)

    return reply.send(user)
}
