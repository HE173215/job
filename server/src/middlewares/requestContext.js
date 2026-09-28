import { randomUUID } from "node:crypto";

const REQUEST_ID_PATTERN = /^[A-Za-z0-9._-]{8,100}$/;

export const requestContext = (req, res, next) => {
  const supplied = req.get("x-request-id");
  req.id = REQUEST_ID_PATTERN.test(supplied ?? "") ? supplied : randomUUID();
  res.set("x-request-id", req.id);

  const startedAt = process.hrtime.bigint();
  res.once("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    console.info(JSON.stringify({
      event: "http_request",
      requestId: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
      ip: req.ip,
      userId: req.user?.id,
    }));
  });

  next();
};
