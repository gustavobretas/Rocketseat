import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { resolve, dirname } from 'node:path'
import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
// import { z } from 'zod'
// import axios from 'axios'
// import { prisma } from '../lib/prisma'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 1024 * 1024 * 5, // 5mb
      },
    })

    if (!upload) {
      return reply.status(400).send('No file added')
    }

    const mimeTypeRegex = /^image\/(jpeg|png)$|^video\/(mp4)$/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send('Invalid file format')
    }

    const fileName = randomUUID().concat(`-${upload.filename}`)

    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads', fileName),
    )

    if (!existsSync(dirname(writeStream.path.toString()))) {
      mkdirSync(dirname(writeStream.path.toString()))
    }
    await pump(upload.file, writeStream)

    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return { fileUrl }
  })
}
