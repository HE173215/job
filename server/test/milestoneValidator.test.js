import assert from "node:assert/strict";
import test from "node:test";
import {
  validateCreateMilestone,
  validateMilestoneList,
} from "../src/validators/milestoneValidator.js";

const run = (middleware, req) =>
  new Promise((resolve) => middleware(req, {}, (error) => resolve(error)));

test("milestone list applies defaults and caps requested page size", async () => {
  const validRequest = { query: {} };
  assert.equal(await run(validateMilestoneList(), validRequest), undefined);
  assert.deepEqual(validRequest.validated, {
    page: 1,
    limit: 12,
    featured: undefined,
    published: undefined,
    search: undefined,
    era: undefined,
    sort: { order: 1, date: 1, year: 1 },
  });

  const invalidRequest = { query: { limit: "101" } };
  const error = await run(validateMilestoneList(), invalidRequest);
  assert.equal(error.statusCode, 422);

  const deepPageRequest = { query: { page: "1001" } };
  const deepPageError = await run(validateMilestoneList(), deepPageRequest);
  assert.equal(deepPageError.statusCode, 422);
});

test("milestone create validates input and sanitizes rich text", async () => {
  const req = {
    body: {
      year: 0,
      title: "Mốc lịch sử mẫu",
      slug: "moc-lich-su-mau",
      content: '<p>Nội dung mẫu</p><script>alert("x")</script><img src="https://attacker.example/tracker.png">',
    },
  };

  assert.equal(await run(validateCreateMilestone, req), undefined);
  assert.equal(req.validated.body.content, "<p>Nội dung mẫu</p>");
});

test("milestone image metadata requires Cloudinary identity and HTTPS", async () => {
  const req = {
    body: {
      year: 0,
      title: "Mốc lịch sử mẫu",
      slug: "moc-lich-su-mau",
      coverImage: { url: "http://example.test/image.jpg" },
    },
  };

  const error = await run(validateCreateMilestone, req);
  assert.equal(error.statusCode, 422);
  assert.ok(error.errors.some(({ field }) => field === "coverImage.publicId"));
  assert.ok(error.errors.some(({ field }) => field === "coverImage.url"));
});
