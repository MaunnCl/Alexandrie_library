import { CongressService } from "../../src/services/congress.service";
import { CongressRepository } from "../../src/repository/congress.repository";

jest.mock("../../src/repository/congress.repository");

describe("CongressService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should create a congress", async () => {
    const mockCongress = {
      id: 1,
      name: "Test Congress",
      key: "test-key",
      session_ids: [],
      picture: null,
      date: "2025-04-15",
      city: "Paris",
    };
    (CongressRepository.create as jest.Mock).mockResolvedValue(mockCongress);

    const congress = await CongressService.create("Test Congress", "test-key", [], null, "2025-04-15", "Paris");

    expect(congress.id).toBe(1);
    expect(congress.name).toBe("Test Congress");
    expect(CongressRepository.create).toHaveBeenCalledWith("Test Congress", "test-key", [], null, "2025-04-15", "Paris");
  });

  it("should get congress by id", async () => {
    const mockCongress = {
      id: 1,
      name: "Test Congress",
      key: "test-key",
      session_ids: [],
      picture: null,
      date: "2025-04-15",
      city: "Paris",
    };
    (CongressRepository.findById as jest.Mock).mockResolvedValue(mockCongress);

    const congress = await CongressService.getById(1);

    expect(congress.id).toBe(1);
    expect(congress.name).toBe("Test Congress");
    expect(CongressRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should update a congress", async () => {
    const mockUpdatedCongress = {
      id: 1,
      name: "Updated Congress",
      key: "updated-key",
      session_ids: [],
      picture: null,
      date: "2025-04-16",
      city: "Lyon",
    };
    (CongressRepository.update as jest.Mock).mockResolvedValue(mockUpdatedCongress);

    const updatedCongress = await CongressService.update(1, "Updated Congress", "updated-key", [], null, "2025-04-16", "Lyon");

    expect(updatedCongress.name).toBe("Updated Congress");
    expect(CongressRepository.update).toHaveBeenCalledWith(1, "Updated Congress", "updated-key", [], null, "2025-04-16", "Lyon");
  });

  it("should delete a congress", async () => {
    (CongressRepository.delete as jest.Mock).mockResolvedValue(true);

    await expect(CongressService.delete(1)).resolves.not.toThrow();
    expect(CongressRepository.delete).toHaveBeenCalledWith(1);
  });

  it("should add session id to congress", async () => {
    const initialCongress = {
      id: 1,
      name: "Congress",
      key: "key",
      session_ids: [],
      picture: null,
      date: "2025-04-15",
      city: "Paris"
    };
  
    const updatedCongressMock = {
      ...initialCongress,
      session_ids: [2]
    };
  
    (CongressRepository.findById as jest.Mock).mockResolvedValue(initialCongress);
    (CongressRepository.update as jest.Mock).mockResolvedValue(updatedCongressMock);
  
    const updatedCongress = await CongressService.addSessionToCongress(1, 2);
  
    expect(updatedCongress.session_ids).toContain(2);
    expect(CongressRepository.update).toHaveBeenCalledWith(
      1,
      "Congress",
      "key",
      [2],
      null,
      "2025-04-15",
      "Paris"
    );
  });
  
  it("should remove session id from congress", async () => {
    const initialCongress = {
      id: 1,
      name: "Congress",
      key: "key",
      session_ids: [2],
      picture: null,
      date: "2025-04-15",
      city: "Paris"
    };
  
    const updatedCongressMock = {
      ...initialCongress,
      session_ids: []
    };
  
    (CongressRepository.findById as jest.Mock).mockResolvedValue(initialCongress);
    (CongressRepository.update as jest.Mock).mockResolvedValue(updatedCongressMock);
  
    const updatedCongress = await CongressService.removeSessionFromCongress(1, 2);
  
    expect(updatedCongress.session_ids).not.toContain(2);
    expect(CongressRepository.update).toHaveBeenCalledWith(
      1,
      "Congress",
      "key",
      [],
      null,
      "2025-04-15",
      "Paris"
    );
  });
});
