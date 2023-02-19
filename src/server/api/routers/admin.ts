import { hashSync } from "bcrypt";
import { z } from "zod";
import generateStrongPassword from "../../../utils/generateStrongPassword";
import { stripUser } from "../../../utils/stripSensitiveValues";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();
    
    // return a list of users with password hashes stripped
    return users.map(stripUser);
  }),

  createUser: protectedProcedure.input(z.object({
    username: z.string().max(32),
  })).mutation(async ({ ctx, input }) => {
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
});
