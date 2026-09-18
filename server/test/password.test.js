import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "../src/utils/password.js";

test("passwords are stored as salted scrypt hashes", async () => {
  const password = "a-strong-test-password";
  const first = await hashPassword(password);
  const second = await hashPassword(password);

  assert.notEqual(first, password);
  assert.notEqual(first, second);
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword("wrong-password", first), false);
});
