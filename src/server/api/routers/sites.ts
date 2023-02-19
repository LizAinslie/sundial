import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const sitesRouter = createTRPCRouter({
  getSites: protectedProcedure.query(async ({ ctx }) => {
    const sites = await ctx.prisma.site.findMany();
    return sites;
  }),
  createSite: protectedProcedure.input(z.object({
    name: z.string().optional(),
    lat: z.number(),
    lon: z.number(),
    address: z.string(),
  })).mutation(async ({ ctx, input }) => {
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
