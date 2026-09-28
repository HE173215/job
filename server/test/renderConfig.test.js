import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";

test("production config supports Render and cross-site Vercel cookies", async () => {
  process.env.NODE_ENV = "production";
  process.env.CLIENT_URL = "https://frontend.example";
  process.env.TRUST_PROXY_HOPS = "1";

  const { AUTH_COOKIE_NAME, authCookieOptions } = await import("../src/config/auth.js");
  const { app } = await import("../src/app.js");
  const { login, logout } = await import("../src/controllers/authController.js");
  const { authService } = await import("../src/services/authService.js");

  assert.equal(AUTH_COOKIE_NAME, "token");
  assert.deepEqual(authCookieOptions, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  assert.equal(app.get("trust proxy"), 1);

  const originalLogin = authService.login;
  const calls = [];
  const response = {
    cookie(name, value, options) {
      calls.push(["cookie", name, value, options]);
      return this;
    },
    clearCookie(name, options) {
      calls.push(["clearCookie", name, options]);
      return this;
    },
    status() {
      return this;
    },
    json() {
      return this;
    },
  };
  authService.login = async () => ({ token: "test-token", user: {}, maxAge: 1000 });

  try {
    await login({ validated: {} }, response);
    logout({}, response);
    assert.deepEqual(calls[0], [
      "cookie",
      "token",
      "test-token",
      { ...authCookieOptions, maxAge: 1000 },
    ]);
    assert.deepEqual(calls[1], ["clearCookie", "token", authCookieOptions]);
  } finally {
    authService.login = originalLogin;
  }

  const server = app.listen(0);
  await once(server, "listening");
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    for (const path of ["/", "/api/v1/health/live"]) {
      const response = await fetch(`${base}${path}`);
      assert.equal(response.status, 200);
      assert.deepEqual(await response.json(), {
        success: true,
        message: "API is running",
      });
    }

    const notReady = await fetch(`${base}/api/v1/health`);
    assert.equal(notReady.status, 503);

    const allowed = await fetch(`${base}/api/v1/health`, {
      headers: { origin: "https://frontend.example" },
    });
    assert.equal(allowed.headers.get("access-control-allow-origin"), "https://frontend.example");
    assert.equal(allowed.headers.get("access-control-allow-credentials"), "true");

    const denied = await fetch(`${base}/api/v1/health`, {
      headers: { origin: "https://attacker.example" },
    });
    assert.equal(denied.status, 403);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
