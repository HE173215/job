import assert from "node:assert/strict";
import test from "node:test";
import { Milestone } from "../src/models/Milestone.js";
import { milestoneSeed } from "../src/seeds/seedMilestones.js";

test("official milestone seed is valid, ordered and source-backed", async () => {
  await Promise.all(milestoneSeed.map((item) => new Milestone(item).validate()));

  assert.equal(new Set(milestoneSeed.map(({ slug }) => slug)).size, milestoneSeed.length);
  assert.deepEqual(
    milestoneSeed.map(({ order }) => order),
    [...milestoneSeed.map(({ order }) => order)].sort((a, b) => a - b),
  );
  for (const item of milestoneSeed) {
    assert.equal(item.published, true);
    assert.equal(new URL(item.source).hostname, "www.qdnd.vn");
  }
});
