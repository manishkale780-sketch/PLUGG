import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.user.upsert({
    where: { phone: "9999999999" },
    update: {},
    create: {
      phone: "9999999999",
      email: "admin@plugg.com",
      passwordHash: hashedPassword,
      fullName: "PLUGG Admin",
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log("Admin user created:");
  console.log("Phone: 9999999999");
  console.log("Password: admin123");
  console.log("Role:", admin.role);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
