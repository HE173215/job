import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";

test("admin routes reject requests without the httpOnly auth cookie", async () => {
  const { app } = await import("../src/app.js");
  const server = app.listen(0);
  await once(server, "listening");

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/api/v1/admin/news`);
    assert.equal(response.status, 401);
    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.message, "Authentication required");
    assert.deepEqual(body.errors, []);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
