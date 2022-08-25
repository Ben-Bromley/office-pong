import { createRouter } from "./context";
import { z } from "zod";

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
    async resolve({ ctx }) {
      return await ctx.prisma.user.findMany();
    },
  });
