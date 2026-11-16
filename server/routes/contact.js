
import express from "express";

import {
    getContacts,
    getContact,
    createContact,
    updateContact,
    deleteContact,
    deleteContacts
} from "../controllers/contact.js";

import requireAuth, { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Logged-in Admins and Users can view contacts
router.get("/", requireAuth, getContacts);
router.get("/:id", requireAuth, getContact);

// Anyone can submit the public contact form
router.post("/", createContact);

// Only Admin can update or delete contacts
router.put("/:id", requireAuth, requireAdmin, updateContact);
router.delete("/:id", requireAuth, requireAdmin, deleteContact);
router.delete("/", requireAuth, requireAdmin, deleteContacts);

export default router;
