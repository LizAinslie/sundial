import { createTRPCRouter } from "./trpc";
import { adminRouter } from "./routers/admin";
import { sitesRouter } from "./routers/sites";
import { timeClockRouter } from "./routers/timeClock";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  sites: sitesRouter,
  timeClock: timeClockRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
