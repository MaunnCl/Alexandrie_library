import { OratorsService } from "../../src/services/orators.service";
import { OratorsRepository } from "../../src/repository/orators.repository";

jest.mock("../../repository/orators.repository");

describe("OratorsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an orator", async () => {
    const mockOrator = {
      id: 1,
      name: "Orator 1",
      picture: "http://image.com",
      content_ids: [],
      country: "France",
      city: "Paris"
    };
    (OratorsRepository.create as jest.Mock).mockResolvedValue(mockOrator);

    const orator = await OratorsService.create(mockOrator);

    expect(orator.id).toBe(1);
    expect(orator.name).toBe("Orator 1");
    expect(OratorsRepository.create).toHaveBeenCalledWith(mockOrator);
  });

  it("should get an orator by id", async () => {
    const mockOrator = { id: 1, name: "Orator 1" };
    (OratorsRepository.findById as jest.Mock).mockResolvedValue(mockOrator);

    const orator = await OratorsService.getById(1);

    expect(orator.id).toBe(1);
    expect(orator.name).toBe("Orator 1");
    expect(OratorsRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should update an orator", async () => {
    const mockUpdatedOrator = {
      id: 1,
      name: "Updated Orator",
      picture: "http://updated.com",
      content_ids: [],
      country: "USA",
      city: "NY"
    };
    (OratorsRepository.update as jest.Mock).mockResolvedValue(mockUpdatedOrator);

    const updatedOrator = await OratorsService.update(1, mockUpdatedOrator);

    expect(updatedOrator.name).toBe("Updated Orator");
    expect(OratorsRepository.update).toHaveBeenCalledWith(1, mockUpdatedOrator);
  });

  it("should delete an orator", async () => {
    (OratorsRepository.delete as jest.Mock).mockResolvedValue(true);

    await expect(OratorsService.delete(1)).resolves.not.toThrow();
    expect(OratorsRepository.delete).toHaveBeenCalledWith(1);
  });

  it("should add content id to orator", async () => {
    const mockOrator = { id: 1, content_ids: [2] };
    (OratorsRepository.findById as jest.Mock).mockResolvedValue(mockOrator);
    (OratorsRepository.update as jest.Mock).mockResolvedValue({ ...mockOrator, content_ids: [2, 3] });

    const updatedOrator = await OratorsService.addContentToOrator(1, 3);

    expect(updatedOrator.content_ids).toContain(3);
    expect(OratorsRepository.update).toHaveBeenCalledWith(1, { content_ids: [2, 3] });
  });

  it("should remove content id from orator", async () => {
    const mockOrator = { id: 1, content_ids: [2, 3] };
    (OratorsRepository.findById as jest.Mock).mockResolvedValue(mockOrator);
    (OratorsRepository.update as jest.Mock).mockResolvedValue({ ...mockOrator, content_ids: [2] });

    const updatedOrator = await OratorsService.removeContentFromOrator(1, 3);

    expect(updatedOrator.content_ids).not.toContain(3);
    expect(OratorsRepository.update).toHaveBeenCalledWith(1, { content_ids: [2] });
  });
});
