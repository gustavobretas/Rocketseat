import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@gmail.com",
      avatarUrl: "https://thispersondoesnotexist.com/image",
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "My first pool",
      code: "BOL123",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-10T12:00:00.000Z",
      firstTeamCountryCode: "DE",
      secondTeamCountryCode: "BR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-11T12:00:00.000Z",
      firstTeamCountryCode: "AR",
      secondTeamCountryCode: "BR",

      guesses: {
        create: {
          firstTeamScore: 1,
          secondTeamScore: 3,

          participant: {
            connect: {
                userId_poolId: {
                    userId: user.id,
                    poolId: pool.id
                }
            }
          }
        },
      },
    },
  });
}

main();
