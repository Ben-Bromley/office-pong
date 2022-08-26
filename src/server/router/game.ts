import { createRouter } from "./context";
import { z } from "zod";

export const gameRouter = createRouter()
  .mutation("create", {
    input: z
      .object({
        p1: z.string(),
        p2: z.string(),
        p1_score: z.number(),
        p2_score: z.number(),
      }),
    async resolve({ input, ctx }) {
      try {
        // create user in db
        const user = await ctx.prisma.game.create({
          data: {
            playerOneId: input.p1,
            playerOneScore: input.p1_score,
            playerTwoId: input.p2,
            playerTwoScore: input.p2_score,
            duration: "00:00"
          },
        })
      } catch (e: any) {
        return {status: "error", error: e.message}
      }
      return {
        status: "success",
      }
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.game.findMany();
    },
  });
