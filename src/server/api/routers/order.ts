import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

function generateOrderNumber(): string {
  const prefix = "PLG";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

function generatePickupToken(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      buyerId: z.string(),
      inventoryId: z.string(),
      fulfillmentType: z.enum(["STORE_PICKUP", "HOME_DELIVERY"]),
      deliveryAddress: z.object({
        address: z.string(),
        city: z.string(),
        state: z.string(),
        pincode: z.string(),
      }).optional(),
      quantity: z.number().int().min(1).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get inventory with product details
      const inventory = await ctx.db.inventory.findUnique({
        where: { id: input.inventoryId },
        include: { product: true, shop: true },
      });

      if (!inventory) {
        throw new Error("Product not available");
      }

      if (inventory.stockQuantity < input.quantity) {
        throw new Error("Insufficient stock");
      }

      const subtotal = inventory.sellingPrice * input.quantity;
      const taxRate = 0.18; // 18% GST
      const taxAmount = subtotal * taxRate;
      const deliveryFee = input.fulfillmentType === "HOME_DELIVERY" ? 50 : 0;
      const totalAmount = subtotal + taxAmount + deliveryFee;

      const order = await ctx.db.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          buyerId: input.buyerId,
          shopId: inventory.shopId,
          inventoryId: input.inventoryId,
          status: "PENDING",
          fulfillmentType: input.fulfillmentType,
          pickupToken: input.fulfillmentType === "STORE_PICKUP" ? generatePickupToken() : null,
          deliveryAddress: input.deliveryAddress ? JSON.stringify(input.deliveryAddress) : null,
          items: JSON.stringify([{
            productId: inventory.productId,
            productName: inventory.product.name,
            quantity: input.quantity,
            mrp: inventory.mrp,
            sellingPrice: inventory.sellingPrice,
            variantData: inventory.variantData,
          }]),
          subtotal,
          taxAmount,
          deliveryFee,
          totalAmount,
          paymentStatus: "PENDING",
        },
      });

      // Reduce stock
      await ctx.db.inventory.update({
        where: { id: input.inventoryId },
        data: { stockQuantity: { decrement: input.quantity } },
      });

      return order;
    }),

  getByBuyer: publicProcedure
    .input(z.object({ buyerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.db.order.findMany({
        where: { buyerId: input.buyerId },
        include: {
          shop: true,
          inventory: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return orders.map(order => ({
        ...order,
        items: JSON.parse(order.items),
        deliveryAddress: order.deliveryAddress ? JSON.parse(order.deliveryAddress) : null,
      }));
    }),

  getByShop: publicProcedure
    .input(z.object({ shopId: z.string() }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.db.order.findMany({
        where: { shopId: input.shopId },
        include: {
          buyer: {
            select: { id: true, fullName: true, phone: true },
          },
          inventory: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return orders.map(order => ({
        ...order,
        items: JSON.parse(order.items),
        deliveryAddress: order.deliveryAddress ? JSON.parse(order.deliveryAddress) : null,
      }));
    }),

  updateStatus: publicProcedure
    .input(z.object({
      orderId: z.string(),
      status: z.enum(["PENDING", "CONFIRMED", "READY", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const order = await ctx.db.order.update({
        where: { id: input.orderId },
        data: { status: input.status },
      });

      return order;
    }),

  getById: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input.orderId },
        include: {
          buyer: {
            select: { id: true, fullName: true, phone: true },
          },
          shop: true,
          inventory: {
            include: { product: true },
          },
        },
      });

      if (!order) return null;

      return {
        ...order,
        items: JSON.parse(order.items),
        deliveryAddress: order.deliveryAddress ? JSON.parse(order.deliveryAddress) : null,
      };
    }),
});
