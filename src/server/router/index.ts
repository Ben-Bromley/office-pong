// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { userRouter } from "./user";
import { matchRouter } from "./match";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", protectedExampleRouter)
  .merge("user.", userRouter)
  .merge("match.", matchRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
