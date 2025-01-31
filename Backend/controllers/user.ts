import { userTable } from "../config/schema";
import { Request, Response, RequestHandler } from "express";
import { db } from "../config/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";

dotenv.config();

// 📌 1️⃣ Inscription (Create)
export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const existingUser = await db.select().from(userTable).where(eq(userTable.email, email));
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.insert(userTable).values({ email: email, password: hashedPassword, username: username, firstname: firstName, lastname: lastName });

    res.status(201).json({ message: "Utilisateur créé", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 📌 2️⃣ Connexion (Read)
export const Login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await db.select().from(userTable).where(eq(userTable.email, email));
    if (!user) {
      res.status(400).json({ message: "Utilisateur non trouvé" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      res.status(400).json({ message: "Mot de passe incorrect" });
      return;
    }

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    res.json({ message: "Connexion réussie", token, user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 📌 3️⃣ Obtenir un utilisateur (Read)
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await db.select().from(userTable).where(eq(userTable.id, Number(req.params.id)));
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 📌 4️⃣ Mise à jour des informations (Update)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await db.select().from(userTable).where(eq(userTable.id, Number(req.params.id)));
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user[0].password;
    await db.update(userTable).set({ email, password: hashedPassword }).where(eq(userTable.id, Number(req.params.id)));

    res.json({ message: "Utilisateur mis à jour", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 📌 5️⃣ Suppression de compte (Delete)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await db.select().from(userTable).where(eq(userTable.id, Number(req.params.id)));
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    await db.delete(userTable).where(eq(userTable.id, Number(req.params.id)));
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
