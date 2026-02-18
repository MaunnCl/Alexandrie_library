import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";

process.env.NODE_ENV = 'test';

const token = jwt.sign(
  { id: 1, email: "test@test.com" },
  process.env.JWT_SECRET || "fallback_secret",
  { expiresIn: "1h" }
);

describe("Users routes", () => {
  let createdUserId: number;

  it("should create a user", async () => {
    const res = await request(app).post("/api/users").send({
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      password: "pass1234"
    });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("john.doe@example.com");
    expect(res.body).toHaveProperty("token");
    createdUserId = res.body.id;
  });

  it("should get all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get user by id", async () => {
    const res = await request(app)
      .get(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdUserId);
  });

  it("should update a user", async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ firstname: "Johnny" });
  
    expect(res.status).toBe(200);
    expect(res.body.firstname).toBe("Johnny");
  });

  it("should delete a user", async () => {
    const res = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${token}`);
  
    expect(res.status).toBe(204);
  });
});
