const bcrypt = require("bcryptjs");

// This script creates a hashed password for admin user
// You can use this hashed password directly in your database

async function createAdminPassword() {
  try {
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("🔑 Admin User Credentials:");
    console.log("==========================");
    console.log(`Email: admin@gym.com`);
    console.log(`Password: ${password}`);
    console.log("");
    console.log("🔐 Hashed Password (for database):");
    console.log(hashedPassword);
    console.log("");
    console.log("📝 SQL Command to create admin user:");
    console.log(
      `INSERT INTO "User" (name, email, password, role, username, phone_number, created_at, updated_at) VALUES ('System Administrator', 'admin@gym.com', '${hashedPassword}', 'admin', 'admin', '+1234567890', NOW(), NOW());`
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

createAdminPassword();
