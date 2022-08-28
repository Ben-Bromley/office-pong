import { createRouter } from "./context";
import { z } from "zod";
import { User } from "@prisma/client";

interface UserWithWins extends User {
  wins: number;
}

export const userRouter = createRouter()
  .mutation("create", {
    input: z
      .object({
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
            name: input.name,
          },
        })
      } catch (e: any) {
        return {status: "error", error: e.message}
      }
      return {
        status: "success",
        user: {
          name: input.name,
          email: input.email
        }
      }
    },
  })
  .query("getAll", {
    input: z
      .object({
        // with property should be an optional array of strings
        with: z.array(z.string()).nullish()
      })
      // make arg object optional
      .nullish(),
    async resolve({ ctx, input }) {
      const users = await ctx.prisma.user.findMany();
      if (input?.with?.includes("wins")) {
        // get users and games data
        const matches = await ctx.prisma.match.findMany();
        // for each user, return the user, with total wins
        const usersWithWins: UserWithWins[] = users.map((user) => {
          let wins = 0;
          // get all games for user
          const userGames = matches.filter((g) => [g.playerOneId, g.playerTwoId].includes(user.id));
          userGames.forEach(match => {
            // if user won, increase the win count
            if ((match.playerOneId === user.id && match.playerOneScore > match.playerTwoScore) ||
              (match.playerTwoId === user.id && match.playerTwoScore > match.playerOneScore)) {
              wins = ++wins;
            }
          })
          return {...user, wins}
        });
        return usersWithWins;
      }
      return users;

    },
  });
