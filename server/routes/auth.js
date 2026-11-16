
import express from "express";

import {
    login,
    logout
} from "../controllers/user.js";

import requireAuth from "../middleware/auth.js";

const router = express.Router();

// POST: Sign in
router.post("/signin", login);

// GET: Sign out
router.get("/signout", requireAuth, logout);

export default router;
