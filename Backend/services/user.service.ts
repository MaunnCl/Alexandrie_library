import { UserRepository } from "../repository/user.repository";

export class UserService {
    static async createUser(userData: any) {
        return await UserRepository.createUser(userData);
    }

    static async getAllUsers() {
        return await UserRepository.getAllUsers();
    }

    static async getUserById(id: number) {
        return await UserRepository.getUserById(id);
    }

    static async updateUser(id: number, userData: any) {
        return await UserRepository.updateUser(id, userData);
    }

    static async deleteUser(id: number) {
        return await UserRepository.deleteUser(id);
    }
}
