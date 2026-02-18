import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";

process.env.NODE_ENV = 'test';

const token = jwt.sign(
  { id: 1, email: "test@test.com" },
  process.env.JWT_SECRET || "fallback_secret",
  { expiresIn: "1h" }
);

describe("Content Routes", () => {
  let contentId: number;

  it("should create a content", async () => {
    const response = await request(app)
      .post("/api/contents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Content",
        orator_id: 1,
        description: "Test description",
        url: "http://test.com",
        timeStamp: "test"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    contentId = response.body.id;
  });

  it("should get a content by id", async () => {
    const response = await request(app)
      .get(`/api/contents/${contentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", contentId);
  });

  it("should return 404 when content is not found", async () => {
    const response = await request(app)
      .get("/api/contents/99999")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Content not found");
  });

  it("should update a content", async () => {
    const response = await request(app)
      .put(`/api/contents/${contentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Content",
        orator_id: 1,
        description: "Updated description",
        url: "http://updated.com",
        timeStamp: "update"
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe("Updated Content");
  });

  it("should link content to an orator", async () => {
    const response = await request(app)
      .put(`/api/contents/${contentId}/orator/2`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.orator_id).toBe(2);
  });

  it("should unlink content from an orator", async () => {
    const response = await request(app)
      .delete(`/api/contents/${contentId}/orator`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.orator_id).toBeNull();
  });

  it("should delete a content", async () => {
    const response = await request(app)
      .delete(`/api/contents/${contentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});
