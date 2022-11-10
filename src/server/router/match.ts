import { createRouter } from './context';
import { z } from 'zod';
import EloRank from 'elo-rank';

export const matchRouter = createRouter()
  .mutation('create', {
    input: z.object({
      p1: z.string(),
      p2: z.string(),
      p1_score: z.number(),
      p2_score: z.number()
    }),
    async resolve({ input, ctx }) {
      try {
        // create user in db
        const user = await ctx.prisma.match.create({
          data: {
            playerOneId: input.p1,
            playerOneScore: input.p1_score,
            playerTwoId: input.p2,
            playerTwoScore: input.p2_score,
            duration: '00:00'
          }
        });
      } catch (e: unknown) {
        return { status: 'error', error: (e as Error).message };
      }

      await calculateElo(input, ctx);

      return {
        status: 'success'
      };
    }
  })
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.match.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 30
      });
    }
  });

const calculateElo = async (input: any, ctx: any) => {
  // Calculate new elo - Really don't like this code, but it works
  const elo = new EloRank(15);
  const playerOne = await ctx.prisma.user.findUnique({
    select: { elo: true },
    where: {
      id: input.p1
    }
  });
  const playerTwo = await ctx.prisma.user.findUnique({
    select: { elo: true },
    where: {
      id: input.p2
    }
  });

  const expectedScoreOne = elo.getExpected(playerOne?.elo as number, playerTwo?.elo as number);
  const expectedScoreTwo = elo.getExpected(playerTwo?.elo as number, playerOne?.elo as number);

  // update score, 1 if won 0 if lost
  const playerOneNewElo = elo.updateRating(
    expectedScoreOne,
    input.p1_score > input.p2_score ? 1 : 0,
    playerOne?.elo as number
  );
  const playerTwoNewElo = elo.updateRating(
    expectedScoreTwo,
    input.p2_score > input.p1_score ? 1 : 0,
    playerTwo?.elo as number
  );

  const playerOneUpdate = await ctx.prisma.user.update({
    where: {
      id: input.p1
    },
    data: {
      elo: playerOneNewElo,
      matchesPlayed: {
        increment: 1
      },
      matchesWon: {
        increment: input.p1_score > input.p2_score ? 1 : 0
      }
    }
  });

  const playerTwoUpdate = await ctx.prisma.user.update({
    where: {
      id: input.p2
    },
    data: {
      elo: playerTwoNewElo,
      matchesPlayed: {
        increment: 1
      },
      matchesWon: {
        increment: input.p2_score > input.p1_score ? 1 : 0
      }
    }
  });
};
