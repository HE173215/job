import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { assertServerEnv, env } from "./config/env.js";

const start = async () => {
  assertServerEnv();
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.info(`API listening on port ${env.port}`);
  });

  const shutdown = (signal) => {
    server.close(async () => {
      await disconnectDatabase();
      console.info(`${signal}: server stopped`);
      process.exit(0);
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
};

start().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
