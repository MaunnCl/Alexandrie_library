import bcrypt from 'bcryptjs';
import { UserRepository } from "../repository/user.repository";

export class UserService {
    static async createUser(userData: any) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        userData.password = hashedPassword;
        return await UserRepository.createUser(userData);
    }

    static async getAllUsers() {
        return await UserRepository.getAllUsers();
    }

    static async getUserById(id: number) {
        return await UserRepository.getUserById(id);
    }

    static async updateUser(id: number, userData: any) {
        if (userData.password) {
            const saltRounds = 10;
            userData.password = await bcrypt.hash(userData.password, saltRounds);
        }
        return await UserRepository.updateUser(id, userData);
    }

    static async deleteUser(id: number) {
        return await UserRepository.deleteUser(id);
    }
}
