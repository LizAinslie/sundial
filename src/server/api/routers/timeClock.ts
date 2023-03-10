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
    siteId: z.string(),
  })).mutation(async ({ ctx, input }) => {
    await prisma.event.create({
      data: {
        userId: ctx.session.user.id!,
        siteId: input.siteId,
        type: EventType.START_TRAVEL,
        time: new Date(),
        lat: input.lat,
        lon: input.lon,
      },
    });

    return { success: true };
  }),

  stopTravel: protectedProcedure.input(z.object({
    lat: z.number(),
    lon: z.number(),
    siteId: z.string(),
    clockOut: z.boolean().optional().default(false),
  })).mutation(async ({ ctx, input }) => {
    await prisma.event.create({
      data: {
        userId: ctx.session.user.id!,
        siteId: input.siteId,
        type: EventType.STOP_TRAVEL,
        time: new Date(),
        lat: input.lat,
        lon: input.lon,
      },
    });

    if (input.clockOut) await prisma.event.create({
      data: {
        userId: ctx.session.user.id!,
        siteId: input.siteId,
        type: EventType.CLOCK_OUT,
        time: new Date(),
        lat: input.lat,
        lon: input.lon,
      },
    });

    return { success: true };
  }),

  startBreak: protectedProcedure.input(z.object({
    lat: z.number(),
    lon: z.number(),
    siteId: z.string(),
  })).mutation(async ({ ctx, input }) => {
    await prisma.event.create({
      data: {
        userId: ctx.session.user.id!,
        siteId: input.siteId,
        type: EventType.BREAK_OUT,
        time: new Date(),
        lat: input.lat,
        lon: input.lon,
      },
    });
  }),

  stopBreak: protectedProcedure.input(z.object({
    lat: z.number(),
    lon: z.number(),
    siteId: z.string(),
    clockOut: z.boolean().optional().default(false),
  })).mutation(async ({ ctx, input }) => {
    await prisma.event.create({
      data: {
        userId: ctx.session.user.id!,
        siteId: input.siteId,
        type: EventType.BREAK_IN,
        time: new Date(),
        lat: input.lat,
        lon: input.lon,
      },
    });

    if (input.clockOut) await prisma.event.create({
      data: {
        userId: ctx.session.user.id!,
        siteId: input.siteId,
        type: EventType.CLOCK_OUT,
        time: new Date(),
        lat: input.lat,
        lon: input.lon,
      },
    });

  }),


  clockOut: protectedProcedure.input(z.object({
    lat: z.number(),
    lon: z.number(),
    siteId: z.string(),
  })).mutation(async ({ ctx, input }) => {
    await prisma.event.create({
      data: {
        userId: ctx.session.user.id!,
        siteId: input.siteId,
        type: EventType.CLOCK_OUT,
        time: new Date(),
        lat: input.lat,
        lon: input.lon,
      },
    });

    return { success: true };
  }),
});
