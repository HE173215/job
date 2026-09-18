import assert from "node:assert/strict";
import test from "node:test";

process.env.NODE_ENV = "development";
process.env.CLIENT_URL = "http://localhost:5173";

test("development CORS allows the Vite frontend on localhost:3000", async (t) => {
  const { app } = await import("../src/app.js");
  const server = app.listen(0);
  t.after(() => server.close());

  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/v1/health`, {
    headers: { Origin: "http://localhost:3000" },
  });

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:3000");
  assert.equal(response.headers.get("access-control-allow-credentials"), "true");
});
