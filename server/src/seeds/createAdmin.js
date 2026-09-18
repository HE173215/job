import { connectDatabase, disconnectDatabase } from "../config/db.js";
import { assertAdminEnv, env } from "../config/env.js";
import { User } from "../models/User.js";

const createAdmin = async () => {
  assertAdminEnv();
  await connectDatabase();

  const exists = await User.exists({
    $or: [
      { username: env.adminUsername.toLowerCase() },
      { email: env.adminEmail.toLowerCase() },
    ],
  });

  if (exists) {
    console.info("Admin account already exists; no changes made");
    return;
  }

  await User.create({
    name: env.adminName,
    username: env.adminUsername,
    email: env.adminEmail,
    password: env.adminPassword,
    role: "admin",
    active: true,
  });
  console.info("Admin account created");
};

createAdmin()
  .catch((error) => {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  })
  .finally(disconnectDatabase);
