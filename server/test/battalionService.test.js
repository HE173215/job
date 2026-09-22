import assert from "node:assert/strict";
import test from "node:test";
import { Battalion } from "../src/models/Battalion.js";
import { battalionService } from "../src/services/battalionService.js";

const emptyQuery = () => ({
  sort() {
    return this;
  },
  select() {
    return this;
  },
  async lean() {
    return [];
  },
});

test("empty battalion collection remains empty instead of restoring defaults", async () => {
  const originalFind = Battalion.find;
  const originalInsertMany = Battalion.insertMany;
  let insertCalled = false;

  Battalion.find = emptyQuery;
  Battalion.insertMany = async () => {
    insertCalled = true;
  };

  try {
    assert.deepEqual(await battalionService.listPublished(), []);
    assert.deepEqual(await battalionService.listAdmin(), []);
    assert.equal(insertCalled, false);
  } finally {
    Battalion.find = originalFind;
    Battalion.insertMany = originalInsertMany;
  }
});
