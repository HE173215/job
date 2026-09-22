import assert from "node:assert/strict";
import test from "node:test";
import { validateIntroduction } from "../src/validators/introductionValidator.js";

const validBody = {
  badge: "Cơ cấu",
  title: "Giới thiệu",
  subtitle: "Thông tin tổng quan",
  functionTitle: "Chức năng",
  functionParagraphs: ["Nội dung chức năng"],
  trainingTitle: "Mục tiêu",
  trainingParagraphs: ["Nội dung mục tiêu"],
  notice: "Nội dung đang được cập nhật.",
};

const runValidator = (body) => {
  const req = { body };
  let error;
  validateIntroduction(req, {}, (value) => {
    error = value;
  });
  return { req, error };
};

test("introduction validator accepts and trims complete content", () => {
  const { req, error } = runValidator({
    ...validBody,
    title: "  Giới thiệu  ",
    functionParagraphs: ["  Nội dung chức năng  "],
  });

  assert.equal(error, undefined);
  assert.equal(req.validated.body.title, "Giới thiệu");
  assert.deepEqual(req.validated.body.functionParagraphs, ["Nội dung chức năng"]);
});

test("introduction validator rejects missing fields and empty paragraphs", () => {
  const body = { ...validBody, trainingParagraphs: ["   "] };
  delete body.subtitle;
  const { error } = runValidator(body);

  assert.equal(error.statusCode, 422);
  assert.equal(error.errors.some(({ field }) => field === "subtitle"), true);
  assert.equal(error.errors.some(({ field }) => field === "trainingParagraphs.0"), true);
});

test("introduction validator rejects unknown fields", () => {
  const { error } = runValidator({ ...validBody, published: true });

  assert.equal(error.statusCode, 422);
  assert.deepEqual(error.errors, [{ field: "published", message: "Unknown field" }]);
});
