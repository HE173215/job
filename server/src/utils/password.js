import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export const hashPassword = async (password) => {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt$${salt}$${hash.toString("hex")}`;
};

export const verifyPassword = async (password, storedHash) => {
  const [algorithm, salt, expectedHex] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;

  const expected = Buffer.from(expectedHex, "hex");
  if (expected.length !== KEY_LENGTH) return false;

  const actual = await scrypt(password, salt, KEY_LENGTH);
  return timingSafeEqual(actual, expected);
};
