import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import axios from 'axios'
// import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    })

    const { code } = bodySchema.parse(request.body)

    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    )
    const dataSchema = z.object({
      data: z.object({
        access_token: z.string(),
      }),
    })
    const {
      data: { access_token },
    } = dataSchema.parse(accessTokenResponse)

    console.log(access_token)
    return { access_token }
  })
}
