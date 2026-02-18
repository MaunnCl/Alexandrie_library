import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";

process.env.NODE_ENV = 'test';

const token = jwt.sign(
  { id: 1, email: "test@test.com" },
  process.env.JWT_SECRET || "fallback_secret",
  { expiresIn: "1h" }
);

describe("Orators Routes", () => {
  let createdOratorId: number;

  it("should create an orator", async () => {
    const response = await request(app)
      .post("/api/orators")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Orator",
        picture: "http://test.com",
        country: "France",
        city: "Paris"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    createdOratorId = response.body.id;
  });

  it("should get an orator by id", async () => {
    const response = await request(app)
      .get(`/api/orators/${createdOratorId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdOratorId);
  });

  it("should update an orator", async () => {
    const response = await request(app)
      .put(`/api/orators/${createdOratorId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Updated Orator" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Orator");
  });

  it("should add content id to orator", async () => {
    const response = await request(app)
      .post(`/api/orators/${createdOratorId}/content/3`)
      .set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("content_ids");
    expect(Array.isArray(response.body.content_ids)).toBe(true);
    expect(response.body.content_ids).toContain(3);
  });
  
  it("should remove content id from orator", async () => {
    const response = await request(app)
      .delete(`/api/orators/${createdOratorId}/content/3`)
      .set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("content_ids");
    expect(Array.isArray(response.body.content_ids)).toBe(true);
    expect(response.body.content_ids).not.toContain(3);
  });

  it("should delete an orator", async () => {
    const response = await request(app)
      .delete(`/api/orators/${createdOratorId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
