import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// GST Validation function
function validateGST(gstNumber: string): { valid: boolean; error?: string } {
  const cleanGST = gstNumber.replace(/\s/g, "").toUpperCase();
  const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (!GST_REGEX.test(cleanGST)) {
    return { valid: false, error: "Invalid GST format" };
  }

  const stateCode = cleanGST.substring(0, 2);
  const stateNum = parseInt(stateCode);
  if (stateNum < 1 || stateNum > 37) {
    return { valid: false, error: "Invalid state code in GST" };
  }

  const panNumber = cleanGST.substring(2, 12);
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(panNumber)) {
    return { valid: false, error: "Invalid PAN in GST number" };
  }

  return { valid: true };
}

const shopRegistrationSchema = z.object({
  sellerId: z.string(),
  name: z.string().min(3, "Shop name must be at least 3 characters"),
  tier: z.enum(["TIER_1", "TIER_2"]),
  gstNumber: z.string().optional(),
  address: z.string().min(10, "Address is required"),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^[0-9]{6}$/, "Invalid PIN code"),
  latitude: z.number(),
  longitude: z.number(),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
  email: z.string().email().optional(),
  documentUrls: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.tier === "TIER_2") {
    if (!data.gstNumber) return false;
    const gstValidation = validateGST(data.gstNumber);
    return gstValidation.valid;
  }
  return true;
}, {
  message: "Tier 2 shops require a valid GST number",
  path: ["gstNumber"],
});

export const shopRouter = createTRPCRouter({
  register: publicProcedure
    .input(shopRegistrationSchema)
    .mutation(async ({ ctx, input }) => {
      const existingShop = await ctx.db.shop.findUnique({
        where: { sellerId: input.sellerId },
      });

      if (existingShop) {
        throw new Error("Shop already registered for this user");
      }

      const shop = await ctx.db.shop.create({
        data: {
          sellerId: input.sellerId,
          name: input.name,
          tier: input.tier,
          gstNumber: input.gstNumber,
          address: input.address,
          city: input.city,
          state: input.state,
          pincode: input.pincode,
          latitude: input.latitude,
          longitude: input.longitude,
          phone: input.phone,
          email: input.email,
          documentUrls: input.documentUrls ? JSON.stringify(input.documentUrls) : null,
        },
      });

      return shop;
    }),

  getBySeller: publicProcedure
    .input(z.object({ sellerId: z.string() }))
    .query(async ({ ctx, input }) => {
      const shop = await ctx.db.shop.findUnique({
        where: { sellerId: input.sellerId },
        include: {
          inventory: {
            include: {
              product: true,
            },
          },
          orders: true,
        },
      });

      return shop;
    }),

  getNearby: publicProcedure
    .input(z.object({
      latitude: z.number(),
      longitude: z.number(),
      radiusKm: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      const { latitude, longitude, radiusKm } = input;

      // Haversine formula for distance calculation (SQLite compatible)
      const shops = await ctx.db.$queryRaw`
        SELECT 
          s.*,
          (6371 * acos(
            cos(radians(${latitude})) * 
            cos(radians(s.latitude)) * 
            cos(radians(s.longitude) - radians(${longitude})) + 
            sin(radians(${latitude})) * 
            sin(radians(s.latitude))
          )) AS distance_km
        FROM shops s
        WHERE s.is_active = 1
          AND s.is_verified = 1
        HAVING distance_km <= ${radiusKm}
        ORDER BY distance_km ASC
      `;

      return shops;
    }),

  validateGST: publicProcedure
    .input(z.object({ gstNumber: z.string() }))
    .query(async ({ input }) => {
      return validateGST(input.gstNumber);
    }),
});
