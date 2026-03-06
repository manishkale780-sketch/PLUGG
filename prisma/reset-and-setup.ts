import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("⚠️  Clearing all data except categories and products...");
  
  // Delete in correct order to avoid foreign key constraints
  await prisma.order.deleteMany({});
  console.log("✓ Deleted all orders");
  
  await prisma.inventory.deleteMany({});
  console.log("✓ Deleted all inventory");
  
  await prisma.shop.deleteMany({});
  console.log("✓ Deleted all shops");
  
  await prisma.user.deleteMany({});
  console.log("✓ Deleted all users (sellers and customers)");
  
  console.log("\n👤 Creating new admin user: Manish Shankarrao Kale...");
  
  // Create new admin with OTP-based login (no password needed initially)
  const admin = await prisma.user.create({
    data: {
      phone: "7776843499",
      email: "manishkale780@gmail.com",
      passwordHash: "", // Will be set after OTP verification
      fullName: "Manish Shankarrao Kale",
      role: "ADMIN",
      isVerified: true,
    },
  });
  
  console.log("\n✅ Setup Complete!");
  console.log("\n📱 Admin Details:");
  console.log("   Name: Manish Shankarrao Kale");
  console.log("   Phone: 7776843499");
  console.log("   Email: manishkale780@gmail.com");
  console.log("   Role: ADMIN");
  console.log("\n🔐 Login Method: OTP Only (No password required)");
  console.log("\n⚠️  Note: All previous sellers and customers have been removed.");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
