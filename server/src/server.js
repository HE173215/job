import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { assertServerEnv, env } from "./config/env.js";

const start = async () => {
  assertServerEnv();
  await connectDatabase();

  const server = app.listen(env.port, () => {
    console.info(`API listening on port ${env.port}`);
  });

  let shuttingDown = false;
  const shutdown = (signal, exitCode = 0) => {
    if (shuttingDown) return;
    shuttingDown = true;

    console.info(JSON.stringify({ event: "server_shutdown_started", signal }));
    const forceExit = setTimeout(() => {
      console.error(JSON.stringify({ event: "server_shutdown_timeout", signal }));
      process.exit(1);
    }, env.shutdownTimeoutMs);
    forceExit.unref();

    server.close(async (closeError) => {
      try {
        if (closeError) throw closeError;
        await disconnectDatabase();
        clearTimeout(forceExit);
        console.info(JSON.stringify({ event: "server_shutdown_complete", signal }));
        process.exit(exitCode);
      } catch (error) {
        console.error(JSON.stringify({
          event: "server_shutdown_failed",
          signal,
          message: error.message,
        }));
        process.exit(1);
      }
    });
    server.closeIdleConnections?.();
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("unhandledRejection", (error) => {
    console.error(JSON.stringify({
      event: "unhandled_rejection",
      message: error instanceof Error ? error.message : String(error),
    }));
    shutdown("unhandledRejection", 1);
  });
  process.once("uncaughtException", (error) => {
    console.error(JSON.stringify({ event: "uncaught_exception", message: error.message }));
    shutdown("uncaughtException", 1);
  });
};

start().catch((error) => {
  console.error(JSON.stringify({ event: "server_startup_failed", message: error.message }));
  process.exit(1);
});
