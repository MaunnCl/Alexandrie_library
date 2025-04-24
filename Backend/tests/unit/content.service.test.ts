import { ContentService } from "../../src/services/content.service";
import { ContentRepository } from "../../src/repository/content.repository";
import { timestamp } from "drizzle-orm/mysql-core";
import { timeStamp } from "console";

jest.mock("../../src/repository/content.repository");

describe("ContentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a content", async () => {
    const mockContent = {
      id: 1,
      title: "Test Content",
      orator_id: 1,
      description: "Description",
      url: "http://test.com",
      timeStamp: "test"
    };
    (ContentRepository.create as jest.Mock).mockResolvedValue(mockContent);

    const content = await ContentService.create("Test Content", 1, "Description", "http://test.com", "test");

    expect(content.id).toBe(1);
    expect(content.title).toBe("Test Content");
    expect(ContentRepository.create).toHaveBeenCalledWith("Test Content", 1, "Description", "http://test.com", "test");
  });

  it("should get content by id", async () => {
    const mockContent = {
      id: 1,
      title: "Test Content",
      orator_id: 1,
      description: "Description",
      url: "http://test.com",
      timeStamp: "test"
    };
    (ContentRepository.findById as jest.Mock).mockResolvedValue(mockContent);

    const content = await ContentService.getById(1);

    expect(content.id).toBe(1);
    expect(content.title).toBe("Test Content");
    expect(ContentRepository.findById).toHaveBeenCalledWith(1);
  });

  it("should update a content", async () => {
    const mockUpdatedContent = {
      id: 1,
      title: "Updated Content",
      orator_id: 1,
      description: "Updated Description",
      url: "http://updated.com",
      timeStamp: "update"
    };
    (ContentRepository.update as jest.Mock).mockResolvedValue(mockUpdatedContent);

    const updatedContent = await ContentService.update(1, "Updated Content", 1, "Updated Description", "http://updated.com", "update");

    expect(updatedContent.title).toBe("Updated Content");
    expect(ContentRepository.update).toHaveBeenCalledWith(1, "Updated Content", 1, "Updated Description", "http://updated.com", "update");
  });

  it("should delete a content", async () => {
    const mockDeletedContent = {
      id: 1,
      title: "Deleted Content",
      orator_id: 1,
      description: "Deleted Description",
      url: "http://deleted.com",
      timeStamp: "delete"
    };
    (ContentRepository.delete as jest.Mock).mockResolvedValue(mockDeletedContent);

    const deletedContent = await ContentService.delete(1);
    
    expect(deletedContent.id).toBe(1);
    expect(ContentRepository.delete).toHaveBeenCalledWith(1);
  });

  it("should link content to an orator", async () => {
    const mockLinkedContent = { id: 1, orator_id: 2, title: "Content", description: "", url: "", timeStamp: "" };
    (ContentRepository.updateOrator as jest.Mock).mockResolvedValue(mockLinkedContent);

    const updatedContent = await ContentService.addContentToOrator(1, 2);

    expect(updatedContent.orator_id).toBe(2);
    expect(ContentRepository.updateOrator).toHaveBeenCalledWith(1, { orator_id: 2 });
  });

  it("should unlink content from an orator", async () => {
    const mockUnlinkedContent = { id: 1, orator_id: null, title: "Content", description: "", url: "", timeStamp: "" };
    (ContentRepository.updateOrator as jest.Mock).mockResolvedValue(mockUnlinkedContent);

    const updatedContent = await ContentService.removeContentFromOrator(1);

    expect(updatedContent.orator_id).toBeNull();
    expect(ContentRepository.updateOrator).toHaveBeenCalledWith(1, { orator_id: null });
  });
});
