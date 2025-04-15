import request from "supertest";
import app from "../../app";

process.env.NODE_ENV = 'test';

let createdSessionId: number;

describe("Session Routes", () => {
    it("should create a session", async () => {
      const response = await request(app)
        .post("/api/sessions")
        .send({
          name: "Test Session",
          content_ids: []
        });
  
      console.log("CREATE SESSION RESPONSE:", response.status, response.body);
  
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      createdSessionId = response.body.id;
    });
  
    it("should get session by id", async () => {
      expect(createdSessionId).toBeDefined();
  
      const response = await request(app)
        .get(`/api/sessions/${createdSessionId}`);
  
      console.log("GET SESSION RESPONSE:", response.status, response.body);
  
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdSessionId);
      expect(response.body.name).toBe("Test Session");
    });
  
    it("should update a session", async () => {
      expect(createdSessionId).toBeDefined();
  
      const response = await request(app)
        .put(`/api/sessions/${createdSessionId}`)
        .send({ name: "Updated Session", content_ids: [1] });
  
      console.log("UPDATE SESSION RESPONSE:", response.status, response.body);
  
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated Session");
      expect(response.body.content_ids).toContain(1);
    });
  
    it("should add content to session", async () => {
      expect(createdSessionId).toBeDefined();
  
      const response = await request(app)
        .patch(`/api/sessions/${createdSessionId}/add/2`);
  
      console.log("ADD CONTENT TO SESSION RESPONSE:", response.status, response.body);
  
      expect(response.status).toBe(200);
      expect(response.body.content_ids).toContain(2);
    });
  
    it("should remove content from session", async () => {
      expect(createdSessionId).toBeDefined();
  
      const response = await request(app)
        .patch(`/api/sessions/${createdSessionId}/remove/2`);
  
      console.log("REMOVE CONTENT FROM SESSION RESPONSE:", response.status, response.body);
  
      expect(response.status).toBe(200);
      expect(response.body.content_ids).not.toContain(2);
    });
  
    it("should delete a session", async () => {
      expect(createdSessionId).toBeDefined();
  
      const response = await request(app)
        .delete(`/api/sessions/${createdSessionId}`);
  
      console.log("DELETE SESSION RESPONSE:", response.status);
  
      expect(response.status).toBe(204);
    });
  
    it("should return 404 when session does not exist", async () => {
      const response = await request(app).get("/api/sessions/9999");
  
      console.log("GET NON-EXISTING SESSION RESPONSE:", response.status, response.body);
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Session not found");
    });
  });
