import request from "supertest";
import app from "../../server";

process.env.NODE_ENV = 'test';

describe("Congress Routes", () => {
  let congressId: number;

  it("should create a congress", async () => {
    const response = await request(app).post("/api/congress").send({
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
    const response = await request(app).get(`/api/congress/${congressId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(congressId);
  });

  it("should update a congress", async () => {
    const response = await request(app).put(`/api/congress/${congressId}`).send({
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
    const response = await request(app).post(`/api/congress/${congressId}/session/2`);

    expect(response.status).toBe(200);
    expect(response.body.session_ids).toContain(2);
  });

  it("should remove session from congress", async () => {
    const response = await request(app).delete(`/api/congress/${congressId}/session/2`);

    expect(response.status).toBe(200);
    expect(response.body.session_ids).not.toContain(2);
  });

  it("should delete a congress", async () => {
    const response = await request(app).delete(`/api/congress/${congressId}`);

    expect(response.status).toBe(204);
  });
});
