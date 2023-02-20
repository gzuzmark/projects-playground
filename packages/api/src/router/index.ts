import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { videoRouter } from "./videos";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  video: videoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
