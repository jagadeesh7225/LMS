import express from "express";
import {
  applyLeave,
  getMyLeaves,
  cancelLeave,
  adminAllLeaves,
  updateStatus,
} from "../controllers/leaveController.js";

import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Apply leave (checks for overlapping pending leave)
router.post("/apply", authMiddleware, applyLeave);

// Get user leave history
router.get("/my-leaves", authMiddleware, getMyLeaves);

// Cancel a pending leave
router.put("/cancel/:id", authMiddleware, cancelLeave);

// Admin: get all leaves
router.get("/admin/all", authMiddleware, adminAllLeaves);

// Admin: update approve/reject
router.put("/admin/status/:id", authMiddleware, updateStatus);

export default router;
