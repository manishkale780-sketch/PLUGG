// Test database connection
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Try to query something simple
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Query result:', result);
    
    await prisma.$disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
