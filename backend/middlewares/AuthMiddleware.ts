import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

const secretKey = process.env.SECRET_KEY as string;

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; 
    if (!token) {
      res.status(401).json({ message: "Access Denied" });
      return;
    }
    const verified = jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(400).json({ message: "Invalid Token", error: err });
      }
      req.user = decoded;
      next();
    });

  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

export default authMiddleware;
