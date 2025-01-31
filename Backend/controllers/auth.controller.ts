import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const { token, user } = await AuthService.login(email, password);
            res.status(200).json({ token, user });
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }
}
