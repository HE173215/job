import assert from "node:assert/strict";
import test from "node:test";
import { Introduction } from "../src/models/Introduction.js";
import {
  DEFAULT_INTRODUCTION_CONTENT,
  introductionService,
} from "../src/services/introductionService.js";

test("introduction service returns default content before the first save", async () => {
  const originalFindOne = Introduction.findOne;
  Introduction.findOne = () => ({ lean: async () => null });

  try {
    assert.deepEqual(await introductionService.get(), DEFAULT_INTRODUCTION_CONTENT);
  } finally {
    Introduction.findOne = originalFindOne;
  }
});

test("introduction service upserts the singleton and hides database metadata", async () => {
  const originalFindOneAndUpdate = Introduction.findOneAndUpdate;
  let receivedFilter;
  let receivedUpdate;
  const content = { ...DEFAULT_INTRODUCTION_CONTENT };

  Introduction.findOneAndUpdate = (filter, update) => {
    receivedFilter = filter;
    receivedUpdate = update;
    return {
      lean: async () => ({
        _id: "507f1f77bcf86cd799439011",
        contentKey: "main",
        ...content,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      }),
    };
  };

  try {
    assert.deepEqual(await introductionService.update(content), content);
    assert.deepEqual(receivedFilter, { contentKey: "main" });
    assert.deepEqual(receivedUpdate, {
      $set: content,
      $setOnInsert: { contentKey: "main" },
    });
  } finally {
    Introduction.findOneAndUpdate = originalFindOneAndUpdate;
  }
});
