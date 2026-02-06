import express from "express";
import { getDashboardData, getCategoryBreakdown } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get('/overview', getDashboardData);
router.get('/category-breakdown', getCategoryBreakdown);

export default router;