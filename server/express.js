
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

// Import API routes
import contactRoutes from "./routes/contact.js";
import projectRoutes from "./routes/project.js";
import qualificationRoutes from "./routes/qualification.js";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

// Connect API routes
app.use("/api/contacts", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/qualifications", qualificationRoutes);
app.use("/api/users", userRoutes);

// Authentication routes
app.use("/auth", authRoutes);

export default app;
