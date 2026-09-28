import mongoose from "mongoose";

const adminAuditLogSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, index: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    actorRole: { type: String, enum: ["admin", "editor"], required: true },
    action: { type: String, enum: ["create", "update", "delete"], required: true },
    resourceType: { type: String, required: true, maxlength: 100, index: true },
    resourceId: { type: String, maxlength: 200 },
    changedFields: { type: [String], default: [] },
    method: { type: String, required: true, maxlength: 10 },
    path: { type: String, required: true, maxlength: 500 },
    statusCode: { type: Number, required: true },
    ip: { type: String, maxlength: 100 },
    userAgent: { type: String, maxlength: 500 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

adminAuditLogSchema.index({ createdAt: -1 });
adminAuditLogSchema.index({ resourceType: 1, resourceId: 1, createdAt: -1 });

export const AdminAuditLog = mongoose.model("AdminAuditLog", adminAuditLogSchema);
