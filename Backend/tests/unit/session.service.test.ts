import { SessionService } from "../../src/services/session.service";
import { SessionRepository } from "../../src/repository/session.repository";

jest.mock("../../src/repository/session.repository");

describe("SessionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a session", async () => {
    const mockSession = { id: 1, name: "Test Session", content_ids: [] };
    (SessionRepository.create as jest.Mock).mockResolvedValue(mockSession);

    const session = await SessionService.create("Test Session", []);

    expect(session.id).toBe(1);
    expect(session.name).toBe("Test Session");
    expect(SessionRepository.create).toHaveBeenCalledWith("Test Session", []);
  });

  it("should get session by id", async () => {
    const mockSession = { id: 1, name: "Test Session", content_ids: [] };
    (SessionRepository.findById as jest.Mock).mockResolvedValue(mockSession);

    const session = await SessionService.getById(1);

    expect(session.id).toBe(1);
    expect(session.name).toBe("Test Session");
    expect(SessionRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should update a session", async () => {
    const mockUpdatedSession = { id: 1, name: "Updated Session", content_ids: [1] };
    (SessionRepository.update as jest.Mock).mockResolvedValue(mockUpdatedSession);

    const updatedSession = await SessionService.update(1, "Updated Session", [1]);

    expect(updatedSession.name).toBe("Updated Session");
    expect(updatedSession.content_ids).toContain(1);
    expect(SessionRepository.update).toHaveBeenCalledWith(1, "Updated Session", [1]);
  });

  it("should delete a session", async () => {
    (SessionRepository.delete as jest.Mock).mockResolvedValue(true);

    await expect(SessionService.delete(1)).resolves.not.toThrow();
    expect(SessionRepository.delete).toHaveBeenCalledWith(1);
  });

  it("should add content to session", async () => {
    const mockSession = { id: 1, name: "Session", content_ids: [2, 3] };
    (SessionRepository.findById as jest.Mock).mockResolvedValue(mockSession);
    (SessionRepository.update as jest.Mock).mockResolvedValue({ ...mockSession, content_ids: [2, 3, 4] });

    const updatedSession = await SessionService.addContentToSession(1, 4);

    expect(updatedSession.content_ids).toContain(4);
    expect(SessionRepository.update).toHaveBeenCalledWith(1, "Session", [2, 3, 4]);
  });

  it("should remove content from session", async () => {
    const mockSession = { id: 1, name: "Session", content_ids: [2, 3, 4] };
    (SessionRepository.findById as jest.Mock).mockResolvedValue(mockSession);
    (SessionRepository.update as jest.Mock).mockResolvedValue({ ...mockSession, content_ids: [2, 3] });

    const updatedSession = await SessionService.removeContentFromSession(1, 4);

    expect(updatedSession.content_ids).not.toContain(4);
    expect(SessionRepository.update).toHaveBeenCalledWith(1, "Session", [2, 3]);
  });
});
