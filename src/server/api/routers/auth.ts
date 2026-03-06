import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
        email: z.string().email().optional(),
        password: z.string().min(6, "Password must be at least 6 characters"),
        fullName: z.string().min(2, "Name is required"),
        role: z.enum(["BUYER", "SELLER"]).default("BUYER"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { phone: input.phone },
      });

      if (existingUser) {
        throw new Error("User already exists with this phone number");
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      const user = await ctx.db.user.create({
        data: {
          phone: input.phone,
          email: input.email,
          passwordHash: hashedPassword,
          fullName: input.fullName,
          role: input.role,
        },
      });

      return {
        id: user.id,
        phone: user.phone,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { phone: input.phone },
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isValid = await bcrypt.compare(input.password, user.passwordHash);

      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      return {
        id: user.id,
        phone: user.phone,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      };
    }),
});
