import { boardRouter } from "./routers/board";
import { cardRouter } from "./routers/card";
import { listRouter } from "./routers/list";
import { userRouter } from "./routers/user";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  board: boardRouter,
  list: listRouter,
  card: cardRouter,
});

export type AppRouter = typeof appRouter;
