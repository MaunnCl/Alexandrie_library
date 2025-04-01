import { UserRepository } from "../repository/user.repository";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
    static async login(email: string, password: string) {
        const user = await UserRepository.getUserByEmail(email);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Mot de passe incorrect");
        }

        // Générer un token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as string || '',
            { expiresIn: process.env.JWT_EXPIRES_IN } as SignOptions
        );

        return { token, user };
    }
}
