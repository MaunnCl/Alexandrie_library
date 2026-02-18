import request from "supertest";
import app from "../../app";
import jwt from "jsonwebtoken";

process.env.NODE_ENV = 'test';

const token = jwt.sign(
  { id: 1, email: "test@test.com" },
  process.env.JWT_SECRET || "fallback_secret",
  { expiresIn: "1h" }
);

let createdId: string;

const profileData = {
  user_id: 1,
  profilePicture: "picture.jpg",
  bio: "Hello I am a bio",
  preferences: "dark",
};

describe("UsersProfiles routes", () => {
  it("should create a profile", async () => {
    const res = await request(app)
      .post("/api/users-profiles")
      .set("Authorization", `Bearer ${token}`)
      .send(profileData);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdId = res.body.id;
  });

  it("should get all profiles", async () => {
    const res = await request(app)
      .get("/api/users-profiles")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get profile by id", async () => {
    const res = await request(app)
      .get(`/api/users-profiles/${createdId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  it("should update a profile", async () => {
    const res = await request(app)
      .put(`/api/users-profiles/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ bio: "Updated bio" });
    expect(res.status).toBe(200);
    expect(res.body.bio).toBe("Updated bio");
  });

  it("should delete a profile", async () => {
    const res = await request(app)
      .delete(`/api/users-profiles/${createdId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(204);
  });
});
