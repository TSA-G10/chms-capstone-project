const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/app");
const User = require("../../src/models/User");
const bcrypt = require("bcryptjs");

// Use a separate test DB — set TEST_MONGO_URI in .env
beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI || process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

// ── Helper: create a super_admin user directly in DB ──────────────────────
const createAdminUser = async () => {
  const hashed = await bcrypt.hash("Admin@1234", 12);
  return User.create({
    firstName: "Super",
    lastName: "Admin",
    email: "admin@chms.test",
    password: hashed,
    role: "super_admin",
  });
};

// ── Helper: login and get token ────────────────────────────────────────────
const loginAs = async (email, password) => {
  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password });
  return res.body.data?.accessToken;
};

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /api/v1/auth/register", () => {
  it("should return 403 for a non-admin token", async () => {
    // Create a staff user
    const hashed = await bcrypt.hash("Staff@1234", 12);
    await User.create({
      firstName: "Staff",
      lastName: "User",
      email: "staff@chms.test",
      password: hashed,
      role: "staff",
    });
    const token = await loginAs("staff@chms.test", "Staff@1234");

    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "New",
        lastName: "Pastor",
        email: "pastor@chms.test",
        password: "Pastor@1234",
        role: "pastor",
      });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 when no token is provided", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({
      firstName: "New",
      lastName: "User",
      email: "new@chms.test",
      password: "Pass@1234",
      role: "staff",
    });

    expect(res.statusCode).toBe(401);
  });

  it("should create a user when called by admin", async () => {
    await createAdminUser();
    const token = await loginAs("admin@chms.test", "Admin@1234");

    const res = await request(app)
      .post("/api/v1/auth/register")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Finance",
        lastName: "Officer",
        email: "finance@chms.test",
        password: "Finance@1234",
        role: "finance_officer",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe("finance@chms.test");
    expect(res.body.data.password).toBeUndefined(); // password never returned
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("POST /api/v1/auth/login", () => {
  it("should return access and refresh tokens on valid credentials", async () => {
    await createAdminUser();

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@chms.test", password: "Admin@1234" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
  });

  it("should return 401 on invalid password", async () => {
    await createAdminUser();

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@chms.test", password: "WrongPassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 on unknown email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "ghost@chms.test", password: "Any@1234" });

    expect(res.statusCode).toBe(401);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe("Protected route — authenticate middleware", () => {
  it("should return 401 with no token", async () => {
    const res = await request(app).get("/api/v1/members");
    expect(res.statusCode).toBe(401);
  });

  it("should return 401 with a malformed token", async () => {
    const res = await request(app)
      .get("/api/v1/members")
      .set("Authorization", "Bearer this.is.not.a.real.token");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 with a valid token", async () => {
    await createAdminUser();
    const token = await loginAs("admin@chms.test", "Admin@1234");

    const res = await request(app)
      .get("/api/v1/members")
      .set("Authorization", `Bearer ${token}`);

    // 200 means auth passed (members list returns empty array for new DB — that is fine)
    expect(res.statusCode).toBe(200);
  });
});
