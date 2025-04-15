import { UserProfileRepository } from "../repository/userProfil.repository";

export class UserProfileService {
    static async createUserProfile(profileData: any) {
        return await UserProfileRepository.createUserProfile(profileData);
    }

    static async getAllUserProfiles() {
        return await UserProfileRepository.getAllUserProfiles();
    }

    static async getUserProfileById(id: string) {
        return await UserProfileRepository.getUserProfileById(Number(id));
    }

    static async updateUserProfile(id: string, profileData: any) {
        return await UserProfileRepository.updateUserProfile(id, profileData);
    }

    static async deleteUserProfile(id: string) {
        return await UserProfileRepository.deleteUserProfile(id);
    }
}
