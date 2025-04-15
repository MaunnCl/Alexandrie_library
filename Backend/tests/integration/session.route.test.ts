import request from "supertest";
import app from "../../server";

process.env.NODE_ENV = 'test';

describe("Session Routes", () => {
  let createdSessionId: number;

  it("should create a session", async () => {
    const response = await request(app)
      .post("/api/sessions")
      .send({
        name: "Test Session",
        content_ids: []
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    createdSessionId = response.body.id;
  });

  it("should get session by id", async () => {
    const response = await request(app)
      .get(`/api/sessions/${createdSessionId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdSessionId);
    expect(response.body.name).toBe("Test Session");
  });

  it("should update a session", async () => {
    const response = await request(app)
      .put(`/api/sessions/${createdSessionId}`)
      .send({ name: "Updated Session", content_ids: [1] });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Updated Session");
    expect(response.body.content_ids).toContain(1);
  });

  it("should add content to session", async () => {
    const response = await request(app)
        .patch(`/api/sessions/${createdSessionId}/add/2`);  
    console.log("Session ID (addContent)", createdSessionId);
    console.log("Response", response.body);
  
    expect(response.status).toBe(200);
    expect(response.body.content_ids).toContain(2);
  });

  it("should remove content from session", async () => {
    const response = await request(app)
        .patch(`/api/sessions/${createdSessionId}/remove/2`);

    expect(response.status).toBe(200);
    expect(response.body.content_ids).not.toContain(2);
  });

  it("should delete a session", async () => {
    const response = await request(app)
      .delete(`/api/sessions/${createdSessionId}`);

    expect(response.status).toBe(204);
  });

  it("should return 404 when session does not exist", async () => {
    const response = await request(app)
      .get("/api/sessions/9999");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Session not found");
  });
});
