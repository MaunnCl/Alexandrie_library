import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// 📌 1️⃣ Inscription (Create)
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: "Utilisateur créé", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 📌 2️⃣ Connexion (Read)
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

    res.json({ message: "Connexion réussie", token, user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 📌 3️⃣ Obtenir un utilisateur (Read)
export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
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

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
    await user.update({ email, password: hashedPassword });

    res.json({ message: "Utilisateur mis à jour", user });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 📌 5️⃣ Suppression de compte (Delete)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    await user.destroy();
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
