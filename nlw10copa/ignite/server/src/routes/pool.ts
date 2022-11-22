import { FastifyInstance } from "fastify";
import { z } from 'zod';
import ShortUniqueId from 'short-unique-id';
import { prisma } from "../lib/prisma";

export async function poolRoutes(fastify : FastifyInstance) {

    fastify.get('/pools/count', async () => {        
        const count = await prisma.pool.count();
        return { count };
    });

    fastify.post('/pools/create', async (request, reply) => {     
        const createPoolBodySchema = z.object({
            title: z.string(),
        });   
        const { title } = createPoolBodySchema.parse(request.body);

        const generate = new ShortUniqueId({length: 6});
        const code = String(generate()).toUpperCase();
        await prisma.pool.create({
            data: {
                title,
                code: code,
            },
        });

        return reply.status(201).send({ code });
    });
    
}