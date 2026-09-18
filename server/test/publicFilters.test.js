import assert from "node:assert/strict";
import test from "node:test";
import { Activity } from "../src/models/Activity.js";
import { GalleryAlbum } from "../src/models/GalleryAlbum.js";
import { Milestone } from "../src/models/Milestone.js";
import { News } from "../src/models/News.js";
import { activityService } from "../src/services/activityService.js";
import { galleryService } from "../src/services/galleryService.js";
import { milestoneService } from "../src/services/milestoneService.js";
import { newsService } from "../src/services/newsService.js";

const query = { page: 1, limit: 12, sort: { order: 1 } };

const capturePublicFilter = async (Model, listPublished) => {
  const originalFind = Model.find;
  const originalCount = Model.countDocuments;
  let captured;
  const chain = {
    sort: () => chain,
    skip: () => chain,
    limit: () => chain,
    select: () => chain,
    lean: async () => [],
  };

  Model.find = (filter) => {
    captured = filter;
    return chain;
  };
  Model.countDocuments = async () => 0;

  try {
    await listPublished({ ...query, published: false });
    return captured;
  } finally {
    Model.find = originalFind;
    Model.countDocuments = originalCount;
  }
};

test("all public list services force published=true", async () => {
  const cases = [
    [Milestone, milestoneService.listPublished],
    [News, newsService.listPublished],
    [Activity, activityService.listPublished],
    [GalleryAlbum, galleryService.listPublished],
  ];

  for (const [Model, listPublished] of cases) {
    const filter = await capturePublicFilter(Model, listPublished);
    assert.equal(filter.published, true);
  }
});
