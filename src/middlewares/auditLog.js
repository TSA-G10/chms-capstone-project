const AuditLog = require("../models/AuditLog");

// Attach to sensitive POST/PUT/DELETE routes as middleware
const auditLog = (action, entity) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      // Only log if the request succeeded (2xx)
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        try {
          await AuditLog.create({
            userId: req.user._id,
            action,
            entity,
            entityId: body?.data?._id || req.params?.id || null,
            changes: req.body,
            ip: req.ip,
            timestamp: new Date(),
          });
        } catch (err) {
          // Audit log failure must never break the main response
          console.error("AuditLog write failed:", err.message);
        }
      }
      return originalJson(body);
    };

    next();
  };
};

module.exports = auditLog;
