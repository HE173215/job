import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { auditAdminMutation } from "../src/middlewares/auditAdminMutation.js";
import { authorize } from "../src/middlewares/authorize.js";
import { AdminAuditLog } from "../src/models/AdminAuditLog.js";

test("editor is rejected from admin-only operations", () => {
  let received;
  authorize("admin")({ user: { role: "editor" } }, {}, (error) => { received = error; });
  assert.equal(received.statusCode, 403);
});

test("successful admin mutations create a compact audit record", async () => {
  const originalCreate = AdminAuditLog.create;
  let record;
  AdminAuditLog.create = async (value) => { record = value; };

  const req = {
    id: "request-123",
    method: "PATCH",
    path: "/news/507f1f77bcf86cd799439011",
    originalUrl: "/api/v1/admin/news/507f1f77bcf86cd799439011",
    params: { id: "507f1f77bcf86cd799439011" },
    validated: { body: { title: "Updated" } },
    user: { _id: "507f1f77bcf86cd799439012", role: "admin" },
    ip: "127.0.0.1",
    get: () => "test-agent",
  };
  const res = Object.assign(new EventEmitter(), {
    statusCode: 200,
    locals: {},
    json(body) { return body; },
  });

  try {
    auditAdminMutation(req, res, () => {});
    res.json({ success: true, data: { _id: req.params.id } });
    res.emit("finish");
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(record.action, "update");
    assert.equal(record.resourceType, "news");
    assert.deepEqual(record.changedFields, ["title"]);
    assert.equal(record.resourceId, req.params.id);
  } finally {
    AdminAuditLog.create = originalCreate;
  }
});
