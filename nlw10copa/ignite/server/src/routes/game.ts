import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function gameRoutes(fastify : FastifyInstance) {
    fastify.get('/games/count', async () => {        
        const count = await prisma.game.count();
        return { count };
    });

    fastify.get('/pools/:id/games', { onRequest: [authenticate] }, async (request) => {
        const getPollParams = z.object({
            id: z.string(),
        });

        const { id } = getPollParams.parse(request.params);
        
        const games = await prisma.game.findMany({
            orderBy: {
                date: 'desc',
            },
            include: {
                guesses:{
                    where: {
                        participant: {
                            userId: request.user.sub,
                            poolId: id,
                        }
                    },
                }
            },
        });

        return { games: games.map(game => {
            return {
                ...game,
                guess: game.guesses.length > 0 ? game.guesses[0] : null,
                guesses: undefined,
            }
        }) };
    });

    fastify.post('/pools/:poolsId/games/:gameId/guesses', { onRequest: [authenticate] }, 
        async (request, reply) => {
            const createGuessParamsSchema = z.object({
                poolsId: z.string(),
                gameId: z.string(),
            });

            const createGuessBodySchema = z.object({
                firstTeamScore : z.number(),
                secondTeamScore : z.number(),
            });

            const { poolsId, gameId } = createGuessParamsSchema.parse(request.params);
            const { firstTeamScore, secondTeamScore } = createGuessBodySchema.parse(request.body);

            const participant = await prisma.participant.findUnique({
                where: {
                    userId_poolId: {
                        userId: request.user.sub,
                        poolId: poolsId,
                    }
                }
            });

            if (!participant) {
                return reply.status(404).send({ message: 'Participant not found at this Poll.' });
            }

            const guess = await prisma.guess.findUnique({
                where: {
                    gameId_participantId: {
                        participantId: participant.id,
                        gameId,
                    }
                }
            });

            if (guess) {
                return reply.status(400).send({ message: 'You have already guessed this game at this Poll.' });
            };

            const game = await prisma.game.findUnique({
                where: {
                    id: gameId,
                }
            });

            if (!game) {
                return reply.status(404).send({ message: 'Game not found.' });
            };

            if (game.date < new Date()) {
                return reply.status(400).send({ message: 'You can not guess a game that has already started.' });
            };

            await prisma.guess.create({
                data: {
                    gameId,
                    participantId: participant.id,
                    firstTeamScore,
                    secondTeamScore,
                }
            });

            return reply.status(201).send({ message: 'Guess created successfully.' });
        }
    );
};