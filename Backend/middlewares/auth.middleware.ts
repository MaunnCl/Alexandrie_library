import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
          res.sendStatus(403);
          return;
        }
  
        (req as any).user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  }
