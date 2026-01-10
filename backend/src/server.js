import express, { request, response } from "express";
import taskRoute from "./routes/takesRouters.js";
import userRoute from "./routes/userRouters.js";
import authRoute from "./routes/authRouters.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

// Cấu hình CORS
// Luôn enable CORS để đảm bảo hoạt động trong mọi môi trường
// Priority: FRONTEND_URL > CORS_ORIGIN > mặc định localhost:5173
const corsOrigin =
  process.env.FRONTEND_URL ||
  process.env.CORS_ORIGIN ||
  "http://localhost:5173"; // Mặc định cho cả development và production

const corsOptions = {
  origin: corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Route root - trả về thông tin API hoặc serve frontend
app.get("/", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  } else {
    res.json({
      message: "TodoX API Server",
      version: "1.0.0",
      endpoints: {
        auth: "/api/auth",
        users: "/api/users",
        tasks: "/api/tasks",
      },
      note: "Frontend should be running on http://localhost:5173",
    });
  }
});

//public route
app.use("/api/auth", authRoute);

//private route
// app.use(protectedRoute);
app.use("/api/users", protectedRoute, userRoute);
app.use("/api/tasks", protectedRoute, taskRoute);

// Serve static files và frontend routes trong production
// Phải đặt sau tất cả API routes để không match với /api/*
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // Route catch-all cho frontend SPA routes (chỉ match non-API routes)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Start on Port ${PORT}`);
  });
});
