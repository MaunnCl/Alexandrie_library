import { UsersRolesService } from "../../src/services/usersRoles.service";
import { UsersRolesRepository } from "../../src/repository/usersRoles.repository";

jest.mock("../../src/repository/usersRoles.repository");

describe("UsersRolesService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user-role", async () => {
    const mockData = { user_id: 1, role_id: "uuid-role" };
    const mockResult = { id: "uuid", ...mockData };

    (UsersRolesRepository.create as jest.Mock).mockResolvedValue(mockResult);

    const result = await UsersRolesService.create(mockData);
    expect(result).toEqual(mockResult);
    expect(UsersRolesRepository.create).toHaveBeenCalledWith(mockData);
  });

  it("should return all user-roles", async () => {
    const mockResult = [{ id: "uuid", user_id: 1, role_id: "uuid-role" }];
    (UsersRolesRepository.findAll as jest.Mock).mockResolvedValue(mockResult);

    const result = await UsersRolesService.getAll();
    expect(result).toEqual(mockResult);
  });

  it("should return a user-role by id", async () => {
    const mockResult = { id: "uuid", user_id: 1, role_id: "uuid-role" };
    (UsersRolesRepository.findById as jest.Mock).mockResolvedValue(mockResult);

    const result = await UsersRolesService.getById("uuid");
    expect(result).toEqual(mockResult);
  });

  it("should update a user-role", async () => {
    const mockUpdate = { role_id: "uuid-updated" };
    const mockResult = { id: "uuid", user_id: 1, role_id: "uuid-updated" };

    (UsersRolesRepository.update as jest.Mock).mockResolvedValue(mockResult);

    const result = await UsersRolesService.update("uuid", mockUpdate);
    expect(result).toEqual(mockResult);
  });

  it("should delete a user-role", async () => {
    const mockResult = { id: "uuid", user_id: 1, role_id: "uuid-role" };
    (UsersRolesRepository.delete as jest.Mock).mockResolvedValue(mockResult);

    const result = await UsersRolesService.delete("uuid");
    expect(result).toEqual(mockResult);
  });
});
