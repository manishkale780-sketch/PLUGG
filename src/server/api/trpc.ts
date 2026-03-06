import { initTRPC, TRPCError } from "@trpc/server";
import { type NextRequest } from "next/server";
import { ZodError } from "zod";
import { db } from "@/server/db";

interface CreateContextOptions {
  headers: Headers;
}

export const createTRPCContext = async (opts: { req: NextRequest }) => {
  const headers = new Headers();
  headers.set("x-trpc-source", "nextjs-react");
  
  return {
    db,
    headers,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
