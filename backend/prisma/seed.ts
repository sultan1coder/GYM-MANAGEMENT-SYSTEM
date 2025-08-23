import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Hash the admin password
    const adminPassword = await bcrypt.hash("admin123", 10);

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@gym.com" },
    });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    // Create admin user with minimal required fields
    const admin = await prisma.user.create({
      data: {
        name: "System Administrator",
        email: "admin@gym.com",
        password: adminPassword,
        role: "admin",
        username: "admin",
        profile_picture:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        tokenVersion: 0,
      },
    });

    console.log("✅ Admin user created successfully:");
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Username: ${admin.username}`);
    console.log("   Profile Picture: ✅ Added");
    console.log("");
    console.log("🔑 Default Login Credentials:");
    console.log(`   Email: admin@gym.com`);
    console.log(`   Password: admin123`);
    console.log("");
    console.log("⚠️  IMPORTANT: Change the password after first login!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);

    // If there's a schema issue, try to create with SQL
    console.log("");
    console.log("🔄 Trying alternative approach...");
    console.log("You can manually create the admin user using this SQL:");
    console.log("");
    console.log(
      `INSERT INTO "User" (name, email, password, role, username, profile_picture, created_at, updated_at) VALUES ('System Administrator', 'admin@gym.com', '${await bcrypt.hash(
        "admin123",
        10
      )}', 'admin', 'admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', NOW(), NOW());`
    );
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("🎉 Database seeding completed!");
  })
  .catch(async (e) => {
    console.error("💥 Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
