import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const timeClockRouter = createTRPCRouter({
  clockIn: protectedProcedure.input(z.object({
    siteId: z.string(),
  })).mutation(async ({ ctx }) => {
  }),
});
