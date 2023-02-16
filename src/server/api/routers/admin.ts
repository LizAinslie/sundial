import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  getAllSites: protectedProcedure.query(({ ctx }) => {
  }),
});
