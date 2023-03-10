import { hashSync } from "bcrypt";
import { z } from "zod";
import generateStrongPassword from "../../../utils/generateStrongPassword";
import { stripUser } from "../../../utils/stripSensitiveValues";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  getUsers: protectedProcedure.input(z.object({
    enabled: z.boolean().optional().default(true),
  }).optional()).query(async ({ ctx, input }) => {
    if (!ctx.session.user.admin) throw "Admin only.";

    const users = await ctx.prisma.user.findMany({
      where: {
        enabled: input?.enabled,
      },
    });

    // return a list of users with password hashes stripped
    return users.map(stripUser);
  }),

  createUser: protectedProcedure
    .input(
      z.object({
        username: z.string().max(32),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.admin) throw "Admin only.";
      // Generate a password
      const password = generateStrongPassword();

      // hash password & create user
      const newUser = await ctx.prisma.user.create({
        data: {
          username: input.username,
          passwordHash: hashSync(password, 12),
        },
      });

      // send the user id and generated password back to client
      return {
        userId: newUser.id,
        password,
      };
    }),

  getEventsForSite: protectedProcedure.input(z.object({
    siteId: z.string(),
  })).query(({ ctx, input }) => ctx.prisma.event.findMany({
    where: {
      siteId: input.siteId,
    },
    include: {
      user: true,
    },
  })),
  
  getEventsForUser: protectedProcedure.input(z.object({
    userId: z.string(),
  })).query(({ ctx, input }) => ctx.prisma.event.findMany({
    where: {
      userId: input.userId,
    },
    include: {
      site: true,
    },
  })),
});
