import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoutes.js";
import songRouter from "./routes/songRoutes.js";
dotenv.config(".env");
const PORT = process.env.PORT || 5001;
const app = express();
app.use(express.json());
connectDB();
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));

app.use("/api/songs", songRouter);
app.use("/api/auth", router);

app.get("/", (req, res) => res.send("Backend is running"));

// Only listen locally; Vercel runs this as a serverless function
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
}

export default app;
