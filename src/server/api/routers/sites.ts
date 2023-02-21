import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const sitesRouter = createTRPCRouter({
  getSites: protectedProcedure.input(z.object({
    enabled: z.boolean().optional().default(true),
  })).query(async ({ ctx, input }) => {
    const sites = await ctx.prisma.site.findMany({
      where: {
        enabled: input.enabled,
      },
    });
    return sites;
  }),
  createSite: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        lat: z.number(),
        lon: z.number(),
        address: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) throw "Admins only.";
      const newSite = await ctx.prisma.site.create({
        data: {
          name: input.name,
          address: input.address,
          lat: input.lat,
          lon: input.lon,
        },
      });

      return newSite.id;
    }),
});
