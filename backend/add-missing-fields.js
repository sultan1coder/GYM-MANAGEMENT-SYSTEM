const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addMissingFields() {
  try {
    console.log('Adding missing payment fields...');
    
    // Add the missing fields
    await prisma.$executeRaw`
      ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "processingFee" DOUBLE PRECISION DEFAULT 0;
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'USD';
    `;
    
    console.log('✅ Missing fields added successfully!');
    
    // Verify all fields are now present
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'Payment' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    console.log('\n📋 Complete Payment table structure:');
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
  } catch (error) {
    console.error('❌ Error adding missing fields:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingFields();
