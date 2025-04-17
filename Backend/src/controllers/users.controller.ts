import { Request, Response } from "express";
import { UsersService } from "../services/users.service";
import bcrypt from "bcryptjs";

export class UsersController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;  
      if (!data.password) {
          res.status(400).json({ error: "Password is required" });
      }
      data.password = await bcrypt.hash(data.password, 10);
      const newUser = await UsersService.create(data);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const users = await UsersService.getAll();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const user = await UsersService.getById(Number(req.params.id));
      if (!user)
        res.status(404).json({ message: "User not found" });
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const updated = await UsersService.update(Number(req.params.id), req.body);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      await UsersService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async loginUser(req: Request, res: Response): Promise<void>  {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        res.status(400).json({ error: "Email and password are required" });
      const user = await UsersService.findByEmail(email);
      if (!user)
        res.status(401).json({ error: "Invalid credentials" });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        res.status(401).json({ error: "Invalid credentials" });
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("❌ Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
}