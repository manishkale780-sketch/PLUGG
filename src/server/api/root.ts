import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "@/server/api/routers/auth";
import { shopRouter } from "@/server/api/routers/shop";
import { productRouter } from "@/server/api/routers/product";
import { inventoryRouter } from "@/server/api/routers/inventory";
import { orderRouter } from "@/server/api/routers/order";
import { otpRouter } from "@/server/api/routers/otp";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  shop: shopRouter,
  product: productRouter,
  inventory: inventoryRouter,
  order: orderRouter,
  otp: otpRouter,
});

export type AppRouter = typeof appRouter;
