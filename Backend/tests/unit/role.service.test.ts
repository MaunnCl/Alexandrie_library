import { RoleService } from "../../src/services/role.service";
import { RoleRepository } from "../../src/repository/role.repository";

jest.mock("../../src/repository/role.repository");

describe("RoleService", () => {
  const roleMock = {
    id: "uuid-123",
    role_name: "admin",
    description: "Admin description",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a role", async () => {
    (RoleRepository.create as jest.Mock).mockResolvedValue(roleMock);

    const result = await RoleService.create({
      role_name: "admin",
      description: "Admin description",
    });

    expect(result).toEqual(roleMock);
    expect(RoleRepository.create).toHaveBeenCalledWith({
      role_name: "admin",
      description: "Admin description",
    });
  });

  it("should get all roles", async () => {
    (RoleRepository.findAll as jest.Mock).mockResolvedValue([roleMock]);

    const result = await RoleService.getAll();

    expect(result).toEqual([roleMock]);
  });

  it("should get role by ID", async () => {
    (RoleRepository.findById as jest.Mock).mockResolvedValue(roleMock);

    const result = await RoleService.getById("uuid-123");

    expect(result).toEqual(roleMock);
  });

  it("should update role", async () => {
    (RoleRepository.update as jest.Mock).mockResolvedValue({
      ...roleMock,
      role_name: "new_role",
    });

    const result = await RoleService.update("uuid-123", {
      role_name: "new_role",
    });

    expect(result.role_name).toBe("new_role");
  });

  it("should delete role", async () => {
    (RoleRepository.delete as jest.Mock).mockResolvedValue(roleMock);

    const result = await RoleService.delete("uuid-123");

    expect(result).toEqual(roleMock);
  });
});
