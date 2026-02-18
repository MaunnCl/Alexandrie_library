import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";

process.env.NODE_ENV = 'test';

const token = jwt.sign(
  { id: 1, email: "test@test.com" },
  process.env.JWT_SECRET || "fallback_secret",
  { expiresIn: "1h" }
);

describe("Congress Routes", () => {
  let congressId: number;

  it("should create a congress", async () => {
    const response = await request(app)
      .post("/api/congress")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Congress",
        key: "test-key",
        session_ids: [],
        picture: null,
        date: "2025-04-15",
        city: "Paris"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    congressId = response.body.id;
  });

  it("should get a congress by id", async () => {
    const response = await request(app)
      .get(`/api/congress/${congressId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(congressId);
  });

  it("should update a congress", async () => {
    const response = await request(app)
      .put(`/api/congress/${congressId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Congress",
        key: "updated-key",
        session_ids: [],
        picture: null,
        date: "2025-04-16",
        city: "Lyon"
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Congress");
  });

  it("should add session to congress", async () => {
    const response = await request(app)
      .post(`/api/congress/${congressId}/session/2`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.session_ids).toContain(2);
  });

  it("should remove session from congress", async () => {
    const response = await request(app)
      .delete(`/api/congress/${congressId}/session/2`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.session_ids).not.toContain(2);
  });

  it("should delete a congress", async () => {
    const response = await request(app)
      .delete(`/api/congress/${congressId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
