import { FastifyReply } from 'fastify'

export default async function setRefreshTokenCookie(reply: FastifyReply, userId: number) {
    const refreshToken = await reply.jwtSign({ id: userId }, { expiresIn: '7d' })

    reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 days
    })
}
