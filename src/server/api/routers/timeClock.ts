import { EventType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const timeClockRouter = createTRPCRouter({
  getLastClockState: protectedProcedure.query(async ({ ctx }) => {
    const userEvents = await ctx.prisma.event.findMany({
      orderBy: {
        time: 'desc',
      },
      take: 1,
      include: {
        site: true,
      },
      where: {
        userId: ctx.session.user.id!,
      },
    });

    return userEvents[0] ?? null;
  }),

  clockIn: protectedProcedure.input(z.object({
    siteId: z.string(),
    lat: z.number(),
    lon: z.number(),
  })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.event.create({
      data: {
        userId: ctx.session.user.id as string,
        siteId: input.siteId,
        type: EventType.CLOCK_IN,
        time: new Date(),
        lat: input.lat,
        lon: input.lon,
      },
    });

    return { success: true };
  }),

  startTravel: protectedProcedure.input(z.object({
    lat: z.number(),
    lon: z.number(),
  })).mutation(async ({ ctx, input }) => {
    const userEvents = await ctx.prisma.event.findMany({
      orderBy: {
        time: 'desc',
      },
      take: 1,
      include: {
        site: true,
      },
      where: {
        userId: ctx.session.user.id!,
      },
    });

    if (userEvents.length === 0) return {
      success: false,
      message: 'You has no previous clock state.',
    };

    const latestEvent = userEvents[0]!;
  }),

  clockOut: protectedProcedure.input(z.object({
    lat: z.number(),
    lon: z.number(),
  })).mutation(async ({ ctx, input }) => {
    const userEvents = await ctx.prisma.event.findMany({
      orderBy: {
        time: 'desc',
      },
      take: 1,
      include: {
        site: true,
      },
      where: {
        userId: ctx.session.user.id!,
      },
    });

    if (userEvents.length === 0) return {
      success: false,
      message: 'You has no previous clock state.',
    };

    const latestEvent = userEvents[0]!;

    // if the user hasn't clocked in, don't let them clock out. lmao
    if (latestEvent.type === EventType.CLOCK_OUT) return {
      success: false,
      message: 'You are already clocked out',
    };

    await prisma.event.create({
      data: {
        userId: ctx.session.user.id!,
        siteId: latestEvent.siteId,
        type: EventType.CLOCK_OUT,
        time: new Date(),
        lat: input.lat,
        lon: input.lon,
      },
    });

    return { success: true };
  }),
});
