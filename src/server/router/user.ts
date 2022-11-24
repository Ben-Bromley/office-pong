import { createRouter } from './context';
import { z } from 'zod';
import { User } from '@prisma/client';

interface UserWithWins extends User {
  wins: number;
}

export const userRouter = createRouter()
  .mutation('create', {
    input: z.object({
      name: z.string().nullish(),
      email: z.string().email(),
      password: z.string()
    }),
    async resolve({ input, ctx }) {
      try {
        // create user in db
        const user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            name: input.name
          }
        });
      } catch (e: any) {
        return { status: 'error', error: e.message };
      }
      return {
        status: 'success',
        user: {
          name: input.name,
          email: input.email
        }
      };
    }
  })
  .query('getAll', {
    input: z
      .object({
        // with property should be an optional array of strings
        with: z.array(z.string()).nullish()
      })
      // make arg object optional
      .nullish(),
    async resolve({ ctx, input }) {
      const users = await ctx.prisma.user.findMany();
      if (input?.with?.includes('wins')) {
        // get users and games data
        const matches = await ctx.prisma.match.findMany();
        // for each user, return the user, with total wins
        const usersWithWins: UserWithWins[] = users.map((user) => {
          let wins = 0;
          // get all games for user
          const userGames = matches.filter((g) => [g.playerOneId, g.playerTwoId].includes(user.id));
          userGames.forEach((match) => {
            // if user won, increase the win count
            if (
              (match.playerOneId === user.id && match.playerOneScore > match.playerTwoScore) ||
              (match.playerTwoId === user.id && match.playerTwoScore > match.playerOneScore)
            ) {
              wins = ++wins;
            }
          });
          return { ...user, wins };
        });
        return usersWithWins;
      }
      return users;
    }
  })
  .query('scoreboard', {
    async resolve({ ctx }) {
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          matchesPlayed: true,
          matchesWon: true,
          elo: true
        },
        orderBy: {
          elo: 'desc'
        }
      });
      return users;
    }
  })
  .query('stats', {
    input: z.object({
      id: z.string()
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        select: {
          id: true,
          name: true,
          matchesPlayed: true,
          matchesWon: true
        },
        where: {
          id: input.id
        }
      });

      return user;
    }
  })
  .query('insights', {
    input: z.object({
      id: z.string()
    }),
    async resolve({ ctx, input }) {
      const matches = await ctx.prisma.match.findMany({
        where: {
          OR: [
            {
              playerOneId: input.id
            },
            {
              playerTwoId: input.id
            }
          ]
        }
      });

      // Losses
      const matchesLost = matches.filter(
        (match) =>
          (match.playerOneId === input.id && match.playerOneScore < match.playerTwoScore) ||
          (match.playerTwoId === input.id && match.playerTwoScore < match.playerOneScore)
      );

      const winners = matchesLost.map((match) =>
        match.playerOneId === input.id ? match.playerTwoId : match.playerOneId
      );

      const winnersCount = winners.reduce((acc, opponent) => {
        return acc[opponent] ? { ...acc, [opponent]: acc[opponent] + 1 } : { ...acc, [opponent]: 1 };
      }, {} as Record<string, any>);
      const sortedWinners: [string, number][] = Object.entries(winnersCount).sort((a, b) => b[1] - a[1]);

      // Wins
      const matchesWon = matches.filter(
        (match) =>
          (match.playerOneId === input.id && match.playerOneScore > match.playerTwoScore) ||
          (match.playerTwoId === input.id && match.playerTwoScore > match.playerOneScore)
      );

      const losers = matchesWon.map((match) =>
        match.playerOneId === input.id ? match.playerTwoId : match.playerOneId
      );

      const losersCount = losers.reduce((acc, opponent) => {
        return acc[opponent] ? { ...acc, [opponent]: acc[opponent] + 1 } : { ...acc, [opponent]: 1 };
      }, {} as Record<string, any>);
      const sortedLosers: [string, number][] = Object.entries(losersCount).sort((a, b) => b[1] - a[1]) ?? null;

      const last5matches = matches.slice(-5);
      let eloChange = null;
      if (last5matches.length === 5) {
        const match5Elo =
          last5matches[0]!.playerOneId === input.id ? last5matches[0]!.playerOneElo : last5matches[0]!.playerTwoElo;

        const player = await ctx.prisma.user.findFirst({
          select: {
            elo: true
          },
          where: {
            id: input.id
          }
        });

        eloChange = (player?.elo || 0) - match5Elo;
      }

      return {
        mostLossUser: await ctx.prisma.user.findUnique({ where: { id: sortedWinners?.[0]?.[0] } }),
        mostWinUser: await ctx.prisma.user.findUnique({ where: { id: sortedLosers?.[0]?.[0] } }),
        mostLossPercent: {}, // TODO
        mostWinPercent: {}, // TODO
        eloChange: eloChange
      };
    }
  });
