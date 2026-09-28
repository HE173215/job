import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";

process.env.NODE_ENV = "production";
process.env.CLIENT_URL = "https://frontend.example";
process.env.TRUST_PROXY_HOPS = "1";

test("production login throttling cannot be bypassed with Host localhost", async () => {
  const { app } = await import("../src/app.js");
  const server = app.listen(0);
  await once(server, "listening");

  try {
    const url = `http://127.0.0.1:${server.address().port}/api/v1/auth/login`;
    let response;
    for (let attempt = 0; attempt < 11; attempt += 1) {
      response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", host: "localhost" },
        body: "{}",
      });
    }
    assert.equal(response.status, 429);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("cookie-authenticated mutations require an allowed Origin", async () => {
  const { app } = await import("../src/app.js");
  const server = app.listen(0);
  await once(server, "listening");

  try {
    const url = `http://127.0.0.1:${server.address().port}/api/v1/admin/news`;
    const missingOrigin = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: "token=invalid" },
      body: "{}",
    });
    assert.equal(missingOrigin.status, 403);

    const trustedOrigin = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "token=invalid",
        origin: "https://frontend.example",
      },
      body: "{}",
    });
    assert.equal(trustedOrigin.status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
