import { EventType } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../../db";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const timeClockRouter = createTRPCRouter({
  clockIn: protectedProcedure.input(z.object({
    siteId: z.string(),
  })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.event.create({
      data: {
        userId: ctx.session.user.id as string,
        siteId: input.siteId,
        type: EventType.CLOCK_IN,
        time: new Date(),
      },
    });

    return { success: true };
  }),
  clockOut: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        events: {
          orderBy: {
            time: 'desc',
          },
          take: 1,
          include: {
            site: true,
          },
        },
      },
    });

    // This branch should never be reached. If this method ever returns like
    // this, what the fuck?
    if (!user) return {
      success: false,
      message: 'Logged in user does not exist.'
    };

    if (user.events.length === 0) return {
      success: false,
      message: 'You has no previous clock in.',
    };

    const latestEvent = user.events[0]!;

    // if the user hasn't clocked in, don't let them clock out. lmao
    if (latestEvent.type === EventType.CLOCK_OUT) return {
      success: false,
      message: 'You are already clocked out',
    };

    await prisma.event.create({
      data: {
        userId: user.id,
        siteId: latestEvent.siteId,
        type: EventType.CLOCK_OUT,
        time: new Date(),
      },
    });

    return { success: true };
  }),
});
