import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";

const testUri = process.env.MONGODB_TEST_URI;

test("MongoDB test database supports create/read/delete", { skip: !testUri }, async () => {
  await mongoose.connect(testUri, { serverSelectionTimeoutMS: 10_000 });
  const collection = mongoose.connection.collection("production_hardening_checks");
  const marker = `check-${Date.now()}`;

  try {
    await collection.insertOne({ marker, createdAt: new Date() });
    const found = await collection.findOne({ marker });
    assert.equal(found.marker, marker);
    assert.equal((await collection.deleteOne({ marker })).deletedCount, 1);
  } finally {
    await mongoose.disconnect();
  }
});
