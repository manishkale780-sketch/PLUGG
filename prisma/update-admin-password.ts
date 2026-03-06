import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Updating admin password...");
  
  const passwordHash = bcrypt.hashSync("Admin@2024!", 10);
  
  // Update admin with password
  const admin = await prisma.user.update({
    where: { phone: "7776843499" },
    data: {
      passwordHash: passwordHash,
      isVerified: true,
    },
  });
  
  console.log("\n✅ Admin Password Updated!");
  console.log("\n📱 Admin Login Details:");
  console.log("   Phone: 7776843499");
  console.log("   Password: Admin@2024!");
  console.log("   Name: Manish Shankarrao Kale");
  console.log("   Email: manishkale780@gmail.com");
  console.log("\n🔐 You can now login with password or OTP");
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
