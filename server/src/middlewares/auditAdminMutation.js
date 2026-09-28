import { AdminAuditLog } from "../models/AdminAuditLog.js";

const ACTIONS = Object.freeze({ POST: "create", PUT: "update", PATCH: "update", DELETE: "delete" });

const getResourceType = (path) => path.split("/").filter(Boolean)[0] ?? "unknown";

export const auditAdminMutation = (req, res, next) => {
  const action = ACTIONS[req.method];
  if (!action) return next();

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (!res.locals.auditResourceId && body?.data?._id) {
      res.locals.auditResourceId = String(body.data._id);
    }
    return originalJson(body);
  };

  res.once("finish", () => {
    if (res.statusCode >= 400 || !req.user) return;

    void AdminAuditLog.create({
      requestId: req.id,
      actor: req.user._id,
      actorRole: req.user.role,
      action,
      resourceType: getResourceType(req.path),
      resourceId: res.locals.auditResourceId ?? req.params.id ?? req.params.postId,
      changedFields: Object.keys(req.validated?.body ?? {}),
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    }).catch((error) => {
      console.error(JSON.stringify({
        event: "audit_log_write_failed",
        requestId: req.id,
        message: error.message,
      }));
    });
  });

  return next();
};
