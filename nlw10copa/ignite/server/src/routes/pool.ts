import { FastifyInstance } from "fastify";
import { z } from "zod";
import ShortUniqueId from "short-unique-id";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();
    return { count };
  });

  fastify.post("/pools/create", async (request, reply) => {
    const createPoolBodySchema = z.object({
      title: z.string(),
    });
    const { title } = createPoolBodySchema.parse(request.body);

    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    let ownerId = null;

    try {
      await request.jwtVerify();

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub,
            },
          },
        },
      });
    } catch (err) {
      await prisma.pool.create({
        data: {
          title,
          code: code,
        },
      });
    }

    return reply.status(201).send({ code });
  });

  fastify.post("/pools/join",{ onRequest: [authenticate] },
    async (request, reply) => {
      const joinPollBodySchema = z.object({
        code: z.string(),
      });

      const { code } = joinPollBodySchema.parse(request.body);

      const poll = await prisma.pool.findFirst({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId: request.user.sub,
            },
          },
        },
      });

      if (!poll) {
        return reply.status(404).send({ message: "Poll not found" });
      }

      if (poll.participants.length > 0) {
        return reply
          .status(400)
          .send({ message: "You are already a participant on this poll." });
      }

      if (!poll.ownerId) {
        await prisma.pool.update({
          where: {
            id: poll.id,
          },
          data: {
            ownerId: request.user.sub,
          },
        });
      }

      await prisma.participant.create({
        data: {
          userId: request.user.sub,
          poolId: poll.id,
        },
      });

      return reply
        .status(200)
        .send({ message: "You have successfully joined the poll." });
    }
  );

  fastify.get("/pools", { onRequest: [authenticate] }, async (request) => {
    const polls = await prisma.pool.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub,
          },
        },
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
              },
            },
          },
          take: 4,
        },
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return { polls };
  });

  fastify.get("/pools/:id", { onRequest: [authenticate] }, async (request) => {
    const getPollParamsSchema = z.object({
      id: z.string(),
    });

    const { id } = getPollParamsSchema.parse(request.params);

    const poll = await prisma.pool.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true,
              },
            },
          },
          take: 4,
        },
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return { poll };
  });
}
