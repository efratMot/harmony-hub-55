/**
 * Seed script — run once to hash the default user passwords.
 * Usage: node seed.js
 */
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "data/users.json");

async function seed() {
  const adminHash = await bcrypt.hash("admin123", 10);
  const userHash = await bcrypt.hash("password123", 10);

  const users = [
    {
      id: "admin-1",
      name: "Admin User",
      email: "admin@musicstore.com",
      password: adminHash,
      isAdmin: true,
    },
    {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      password: userHash,
      isAdmin: false,
    },
  ];

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  console.log("✅ Users seeded with hashed passwords!");
  console.log("   Admin: admin@musicstore.com / admin123");
  console.log("   User:  john@example.com / password123");
}

seed();
