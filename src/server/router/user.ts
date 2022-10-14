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
          matchesWon: true,
          elo: true
        },
        where: {
          id: input.id
        }
      });

      // get all matches for user and find the ones they lost
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
      const matchesLost = matches.filter((match) => {
        return (
          (match.playerOneId === input.id && match.playerOneScore < match.playerTwoScore) ||
          (match.playerTwoId === input.id && match.playerTwoScore < match.playerOneScore)
        );
      });

      // loop through the matches and get the users they lost to
      const opponents = matchesLost.map((match) => {
        if (match.playerOneId === input.id) {
          return match.playerTwoId;
        } else {
          return match.playerOneId;
        }
      });

      // sort opponents by most common to least common
      const opponentCounts = opponents.reduce((acc, opponent) => {
        if (acc[opponent]) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          acc[opponent] = acc[opponent] + 1;
        } else {
          acc[opponent] = 1;
        }
        return acc;
      }, {} as Record<string, number>);
      const sortedOpponents = Object.entries(opponentCounts).sort((a, b) => b[1] - a[1]);

      const opponentName = await ctx.prisma.user.findMany({
        where: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          id: sortedOpponents[0][0]
        }
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return { ...user, fearedOpponent: opponentName[0].name, fearedOpponentCount: sortedOpponents[0][1] };
    }
  });
