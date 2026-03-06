import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({
      categorySlug: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }).optional())
    .query(async ({ ctx, input }) => {
      const where: any = { isActive: true };

      if (input?.categorySlug) {
        const category = await ctx.db.category.findUnique({
          where: { slug: input.categorySlug },
        });
        if (category) {
          where.categoryId = category.id;
        }
      }

      if (input?.search) {
        where.OR = [
          { name: { contains: input.search, mode: 'insensitive' } },
          { brand: { contains: input.search, mode: 'insensitive' } },
          { description: { contains: input.search, mode: 'insensitive' } },
        ];
      }

      const products = await ctx.db.product.findMany({
        where,
        include: {
          category: true,
          inventory: {
            where: { isAvailable: true, stockQuantity: { gt: 0 } },
            include: { shop: true },
          },
        },
        take: input?.limit ?? 20,
        skip: input?.offset ?? 0,
        orderBy: { createdAt: 'desc' },
      });

      return products;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { slug: input.slug },
        include: {
          category: true,
          inventory: {
            where: { isAvailable: true, stockQuantity: { gt: 0 } },
            include: { shop: true },
          },
        },
      });

      return product;
    }),

  getNearbySellers: publicProcedure
    .input(z.object({
      productId: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      radiusKm: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      const { productId, latitude, longitude, radiusKm } = input;

      // Get inventory with nearby shops using Haversine formula
      const inventory = await ctx.db.$queryRaw`
        SELECT 
          i.*,
          s.name as shop_name,
          s.address,
          s.city,
          s.phone as shop_phone,
          (6371 * acos(
            cos(radians(${latitude})) * 
            cos(radians(s.latitude)) * 
            cos(radians(s.longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(s.latitude))
          )) AS distance_km
        FROM inventory i
        JOIN shops s ON i.shop_id = s.id
        WHERE i.product_id = ${productId}
          AND i.is_available = 1
          AND i.stock_quantity > 0
          AND s.is_active = 1
          AND s.is_verified = 1
        HAVING distance_km <= ${radiusKm}
        ORDER BY distance_km ASC
        LIMIT 20
      `;

      return inventory;
    }),

  getCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
      },
    });

    return categories;
  }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      categoryId: z.string(),
      brand: z.string().optional(),
      baseMrp: z.number().optional(),
      description: z.string().optional(),
      images: z.array(z.string()).optional(),
      specifications: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Generate slug from name
      const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + "-" + Date.now();

      const product = await ctx.db.product.create({
        data: {
          name: input.name,
          slug,
          categoryId: input.categoryId,
          brand: input.brand,
          baseMrp: input.baseMrp,
          description: input.description,
          images: input.images ? JSON.stringify(input.images) : null,
          specifications: input.specifications ? JSON.stringify(input.specifications) : null,
        },
      });

      return product;
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      brand: z.string().optional(),
      description: z.string().optional(),
      images: z.array(z.string()).optional(),
      baseMrp: z.number().optional(),
      specifications: z.record(z.string(), z.any()).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      
      const product = await ctx.db.product.update({
        where: { id },
        data: {
          ...data,
          images: data.images ? JSON.stringify(data.images) : undefined,
          specifications: data.specifications ? JSON.stringify(data.specifications) : undefined,
        },
      });

      return product;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.product.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),
});
