import request from "supertest";
import app from "../../app";

process.env.NODE_ENV = 'test';

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
    createdUserId = res.body.id;
  });

  it("should get all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get user by id", async () => {
    const res = await request(app).get(`/api/users/${createdUserId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdUserId);
  });

  it("should update a user", async () => {
    const res = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send({ firstname: "Johnny" });
  
    expect(res.status).toBe(200);
    expect(res.body.firstname).toBe("Johnny");
  });

  it("should delete a user", async () => {
    const res = await request(app).delete(`/api/users/${createdUserId}`);
  
    expect(res.status).toBe(204);
  });
});
