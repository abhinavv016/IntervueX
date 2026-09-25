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
        console.warn(
          "[protectRoute] 401 Unauthorized - No clerkId found. Authorization header:",
          req.headers.authorization ? "Present" : "Missing"
        );
        res.status(401).json({ message: "Unauthorized - invalid token" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (!user) {
        console.warn(`[protectRoute] 404 Not Found - User with clerkId "${clerkId}" does not exist in database`);
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