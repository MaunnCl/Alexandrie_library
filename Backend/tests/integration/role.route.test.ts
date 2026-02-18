import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";

process.env.NODE_ENV = 'test';

const token = jwt.sign(
  { id: 1, email: "test@test.com" },
  process.env.JWT_SECRET || "fallback_secret",
  { expiresIn: "1h" }
);

describe("Role routes", () => {
  let createdRoleId: string;

  it("should create a new role", async () => {
    const res = await request(app)
      .post("/api/roles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        role_name: "admin",
        description: "Administrateur avec accès complet",
      });

    expect(res.status).toBe(201);
    expect(res.body.role_name).toBe("admin");
    createdRoleId = res.body.id;
  });

  it("should get all roles", async () => {
    const res = await request(app)
      .get("/api/roles")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get role by id", async () => {
    const res = await request(app)
      .get(`/api/roles/${createdRoleId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdRoleId);
  });

  it("should update a role", async () => {
    const res = await request(app)
      .put(`/api/roles/${createdRoleId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        role_name: "updated_admin",
        description: "Mise à jour du rôle admin",
      });

    expect(res.status).toBe(200);
    expect(res.body.role_name).toBe("updated_admin");
  });

  it("should delete a role", async () => {
    const res = await request(app)
      .delete(`/api/roles/${createdRoleId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
