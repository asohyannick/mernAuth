import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
// Routes
import userRoutes from "./routes/user.route.js";
// middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
// DB
import connectDB from "../config/db.js";
dotenv.config();
const app = express();
connectDB();
const PORT = parseInt(process.env.PORT) || 8000;
// security packages
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// routes
app.use("/api/users/", userRoutes);
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


// middleware
app.use(notFound);
app.use(errorHandler);
// db config
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});
