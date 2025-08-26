const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addPaymentFields() {
  try {
    console.log('Adding enhanced payment fields...');
    
    // Add the missing fields using raw SQL
    await prisma.$executeRaw`
      ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "lateFees" DOUBLE PRECISION DEFAULT 0;
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "taxAmount" DOUBLE PRECISION DEFAULT 0;
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "processingFee" DOUBLE PRECISION DEFAULT 0;
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'USD';
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "gatewayTransactionId" TEXT;
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "gatewayResponse" JSONB;
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "retryCount" INTEGER DEFAULT 0;
    `;
    
    await prisma.$executeRaw`
      ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "nextRetryDate" TIMESTAMP(3);
    `;
    
    console.log('✅ Enhanced payment fields added successfully!');
    
    // Verify the fields were added
    const columns = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'Payment' 
      AND table_schema = 'public'
      ORDER BY ordinal_position;
    `;
    
    console.log('\n📋 Current Payment table structure:');
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
  } catch (error) {
    console.error('❌ Error adding payment fields:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addPaymentFields();
