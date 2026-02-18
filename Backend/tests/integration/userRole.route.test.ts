import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";

process.env.NODE_ENV = 'test';

const token = jwt.sign(
  { id: 1, email: "test@test.com" },
  process.env.JWT_SECRET || "fallback_secret",
  { expiresIn: "1h" }
);

describe("UsersRoles routes", () => {
  let userId: number;
  let roleId: string;
  let userRoleId: string;

  beforeAll(async () => {
    const userRes = await request(app).post("/api/users").send({
      firstname: "Test",
      lastname: "User",
      email: "test-user-role@example.com",
      password: "test1234"
    });
    userId = userRes.body.id;

    const roleRes = await request(app)
      .post("/api/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        role_name: "editor",
        description: "Role for editing content"
      });
    roleId = roleRes.body.id;
  });

  it("should create a user-role", async () => {
    const res = await request(app)
      .post("/api/users-roles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: userId,
        role_id: roleId
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.user_id).toBe(userId);
    expect(res.body.role_id).toBe(roleId);

    userRoleId = res.body.id;
  });

  it("should get a user-role by id", async () => {
    const res = await request(app)
      .get(`/api/users-roles/${userRoleId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userRoleId);
  });

  it("should update a user-role", async () => {
    const res = await request(app)
      .put(`/api/users-roles/${userRoleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ role_id: roleId });

    expect(res.status).toBe(200);
    expect(res.body.role_id).toBe(roleId);
  });

  it("should delete a user-role", async () => {
    const res = await request(app)
      .delete(`/api/users-roles/${userRoleId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });

  it("should delete the user", async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
