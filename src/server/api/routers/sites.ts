import { Site } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const sitesRouter = createTRPCRouter({
  getSites: protectedProcedure.input(z.object({
    enabled: z.boolean().optional().default(true),
  }).optional()).query(async ({ ctx, input }) => {
    const sites = await ctx.prisma.site.findMany({
      where: {
        enabled: input?.enabled,
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

  search: protectedProcedure.input(z.object({
    query: z.string(),
  })).query(async ({ ctx, input }) => {
    if (input.query === '') return [];
    return await ctx.prisma.site.findMany({
      where: {
        OR: [
          {
            name: {
              contains: input.query,
            },
          },
          {
            address: {
              contains: input.query,
            },
          },
        ],
        enabled: true,
      },
    });
  }),
});
