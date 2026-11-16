
import express from "express";

import {
    getQualifications,
    getQualification,
    createQualification,
    updateQualification,
    deleteQualification,
    deleteQualifications
} from "../controllers/qualification.js";

import requireAuth, { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Both Admin and User can view qualifications
router.get("/", requireAuth, getQualifications);
router.get("/:id", requireAuth, getQualification);

// Only Admin can manage qualifications
router.post("/", requireAuth, requireAdmin, createQualification);
router.put("/:id", requireAuth, requireAdmin, updateQualification);
router.delete("/:id", requireAuth, requireAdmin, deleteQualification);
router.delete("/", requireAuth, requireAdmin, deleteQualifications);

export default router;
