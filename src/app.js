// src/app.js

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// ─── Core Middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "ChMS API is running." });
});

// ─── Swagger Routes ────────────────────────────────────────────────────────────
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── API Routes ──────────────────────────────────────────────────────────────
const authRoutes = require("./routes/auth.routes");
const memberRoutes = require("./routes/member.routes");
const orgUnitRoutes = require("./routes/orgUnit.routes");
const fellowshipRoutes = require("./routes/fellowship.routes");
const staffRoutes = require("./routes/staff.routes");
const announcementRoutes = require("./routes/announcement.routes");
const missionRoutes = require("./routes/mission.routes");
const financeRoutes = require("./routes/finance.routes");
const eventRoutes = require("./routes/event.routes");
const reportRoutes = require("./routes/report.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const vendorRoutes = require("./routes/vendor.routes");
const welfareRoutes = require("./routes/welfare.routes");
const programRoutes = require("./routes/program.routes");
const mediaRoutes = require("./routes/media.routes");
const documentRoutes = require("./routes/document.routes");
const auditRoutes = require("./routes/audit.routes");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/members", memberRoutes);
app.use("/api/v1/org-units", orgUnitRoutes);
app.use("/api/v1/fellowships", fellowshipRoutes);
app.use("/api/v1/staff", staffRoutes);
app.use("/api/v1/announcements", announcementRoutes);
app.use("/api/v1/missions", missionRoutes);
app.use("/api/v1/finance", financeRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/welfare", welfareRoutes);
app.use("/api/v1/programs", programRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/documents", documentRoutes);
app.use("/api/v1/audit", auditRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, error: `Route ${req.originalUrl} not found.` });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error."
      : err.message;
  res.status(statusCode).json({ success: false, error: message });
});


module.exports = app;
