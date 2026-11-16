
import express from "express";

import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    deleteUsers,
    login,
    logout
} from "../controllers/user.js";

import requireAuth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/", createUser);
router.post("/login", login);

// Protected routes
router.post("/logout", requireAuth, logout);
router.get("/", requireAuth, getUsers);
router.get("/:id", requireAuth, getUser);
router.put("/:id", requireAuth, updateUser);
router.delete("/:id", requireAuth, deleteUser);
router.delete("/", requireAuth, deleteUsers);

export default router;
