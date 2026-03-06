import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const inventoryRouter = createTRPCRouter({
  getByShop: publicProcedure
    .input(z.object({ shopId: z.string() }))
    .query(async ({ ctx, input }) => {
      const inventory = await ctx.db.inventory.findMany({
        where: { shopId: input.shopId },
        include: {
          product: {
            include: { category: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return inventory.map(item => ({
        ...item,
        variantData: item.variantData ? JSON.parse(item.variantData) : null,
      }));
    }),

  create: publicProcedure
    .input(z.object({
      shopId: z.string(),
      productId: z.string(),
      variantData: z.record(z.string()).optional(),
      mrp: z.number().positive(),
      sellingPrice: z.number().positive(),
      stockQuantity: z.number().int().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const inventory = await ctx.db.inventory.create({
        data: {
          shopId: input.shopId,
          productId: input.productId,
          variantData: input.variantData ? JSON.stringify(input.variantData) : null,
          mrp: input.mrp,
          sellingPrice: input.sellingPrice,
          stockQuantity: input.stockQuantity,
          isAvailable: input.stockQuantity > 0,
        },
        include: {
          product: true,
        },
      });

      return inventory;
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      mrp: z.number().positive().optional(),
      sellingPrice: z.number().positive().optional(),
      stockQuantity: z.number().int().min(0).optional(),
      isAvailable: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const inventory = await ctx.db.inventory.update({
        where: { id },
        data: {
          ...data,
          isAvailable: data.stockQuantity !== undefined 
            ? data.stockQuantity > 0 
            : data.isAvailable,
        },
        include: {
          product: true,
        },
      });

      return inventory;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.inventory.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  claimProduct: publicProcedure
    .input(z.object({
      shopId: z.string(),
      productId: z.string(),
      variantData: z.record(z.string()).optional(),
      mrp: z.number().positive(),
      sellingPrice: z.number().positive(),
      stockQuantity: z.number().int().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if product exists
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      // Check if already claimed
      const existing = await ctx.db.inventory.findFirst({
        where: {
          shopId: input.shopId,
          productId: input.productId,
          variantData: input.variantData ? JSON.stringify(input.variantData) : null,
        },
      });

      if (existing) {
        throw new Error("Product already claimed by this shop");
      }

      const inventory = await ctx.db.inventory.create({
        data: {
          shopId: input.shopId,
          productId: input.productId,
          variantData: input.variantData ? JSON.stringify(input.variantData) : null,
          mrp: input.mrp,
          sellingPrice: input.sellingPrice,
          stockQuantity: input.stockQuantity,
          isAvailable: input.stockQuantity > 0,
        },
        include: {
          product: true,
        },
      });

      return inventory;
    }),
});
