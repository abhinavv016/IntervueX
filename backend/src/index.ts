import express, { Request, Response } from "express";
import { ENV } from "./lib/env";
import cors from "cors";
import { serve } from "inngest/express";
import { functions, inngest } from "./lib/inngest";
import { handleClerkWebhook } from "./lib/clerk-webhook";
import { clerkMiddleware } from '@clerk/express'
import chatRoutes from "./routes/chatRoutes";
import sessionRoutes from "./routes/sessionRoutes";

const app = express();

const allowedOrigins = [
  ENV.CLIENT_URL,
  ENV.CLIENT_URL?.replace(/\/$/, ""),
].filter(Boolean) as string[];

app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
app.use(clerkMiddleware())
app.use("/api/chat",chatRoutes)
app.use("/api/sessions",sessionRoutes)

app.post("/webhooks/clerk", handleClerkWebhook);

app.all("/api/inngest", serve({client:inngest, functions}))

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "health endpoint is up and running",
  });
});

app.listen(ENV.PORT, () =>
  console.log("port running on", ENV.PORT)
);