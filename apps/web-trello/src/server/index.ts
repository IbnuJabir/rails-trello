import { boardRouter } from "./routers/board";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  board: boardRouter,
});

export type AppRouter = typeof appRouter;
