
import express from "express";

import {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    deleteProjects
} from "../controllers/project.js";

import requireAuth, { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Both Admin and User can view projects
router.get("/", requireAuth, getProjects);
router.get("/:id", requireAuth, getProject);

// Only Admin can manage projects
router.post("/", requireAuth, requireAdmin, createProject);
router.put("/:id", requireAuth, requireAdmin, updateProject);
router.delete("/:id", requireAuth, requireAdmin, deleteProject);
router.delete("/", requireAuth, requireAdmin, deleteProjects);

export default router;
