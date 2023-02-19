import { createTRPCRouter } from "./trpc";
import { adminRouter } from "./routers/admin";
import { sitesRouter } from "./routers/sites";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  admin: adminRouter,
  sites: sitesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
