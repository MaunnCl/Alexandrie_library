import { UsersProfilesService } from "../../src/services/usersProfiles.service";
import { UsersProfilesRepository } from "../../src/repository/usersProfiles.repository";

jest.mock("../../src/repository/usersProfiles.repository");

describe("UsersProfilesService", () => {
  const mockProfile = {
    id: "uuid-profile",
    user_id: 1,
    profilePicture: "url",
    bio: "bio text",
    preferences: "pref"
  };

  it("should create a user profile", async () => {
    (UsersProfilesRepository.create as jest.Mock).mockResolvedValue(mockProfile);

    const result = await UsersProfilesService.create(mockProfile);
    expect(result).toEqual(mockProfile);
    expect(UsersProfilesRepository.create).toHaveBeenCalledWith(mockProfile);
  });

  it("should return all profiles", async () => {
    (UsersProfilesRepository.findAll as jest.Mock).mockResolvedValue([mockProfile]);

    const result = await UsersProfilesService.getAll();
    expect(result).toEqual([mockProfile]);
  });

  it("should get profile by ID", async () => {
    (UsersProfilesRepository.findById as jest.Mock).mockResolvedValue(mockProfile);

    const result = await UsersProfilesService.getById("uuid-profile");
    expect(result).toEqual(mockProfile);
  });

  it("should update a profile", async () => {
    (UsersProfilesRepository.update as jest.Mock).mockResolvedValue(mockProfile);

    const result = await UsersProfilesService.update("uuid-profile", { bio: "updated" });
    expect(result).toEqual(mockProfile);
    expect(UsersProfilesRepository.update).toHaveBeenCalledWith("uuid-profile", { bio: "updated" });
  });

  it("should delete a profile", async () => {
    (UsersProfilesRepository.delete as jest.Mock).mockResolvedValue(mockProfile);

    const result = await UsersProfilesService.delete("uuid-profile");
    expect(result).toEqual(mockProfile);
    expect(UsersProfilesRepository.delete).toHaveBeenCalledWith("uuid-profile");
  });
});
