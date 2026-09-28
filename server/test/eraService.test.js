import assert from "node:assert/strict";
import test from "node:test";
import { Era } from "../src/models/Era.js";
import { eraService } from "../src/services/eraService.js";

test("public era reads never seed or mutate an empty collection", async () => {
  const originalFind = Era.find;
  const originalInsertMany = Era.insertMany;
  let inserted = false;
  const chain = { sort: () => chain, select: () => chain, lean: async () => [] };
  Era.find = () => chain;
  Era.insertMany = async () => { inserted = true; };

  try {
    assert.deepEqual(await eraService.listPublished(), []);
    assert.equal(inserted, false);
  } finally {
    Era.find = originalFind;
    Era.insertMany = originalInsertMany;
  }
});
