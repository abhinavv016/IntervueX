import { clerkMiddleware, getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";

export interface AuthRequest extends Request {
  body: any;
  params: any;
  user: {
    id: string,
    name: string,
    email: string,
    profileImage: string | null,
    clerkId: string
  }
}

export const protectRoute = [
  clerkMiddleware(),

  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId: clerkId } = getAuth(req);

      if (!clerkId) {
        res.status(401).json({ message: "Unauthorized - invalid token" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error in protectRoute Middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }
  },
];