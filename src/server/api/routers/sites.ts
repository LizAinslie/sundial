import { createTRPCRouter, protectedProcedure } from "../trpc"

export const sitesRouter = createTRPCRouter({
  getSites: protectedProcedure.query(async ({ ctx }) => {
    const sites = await ctx.prisma.site.findMany();
    return sites;
  }),
});
