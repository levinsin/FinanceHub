import express from "express";
import { createBudget, getBudgets, updateBudget, deleteBudget } from "../controllers/budget.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get('/', getBudgets);
router.post('/', createBudget);
// router.get('/:id', getBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;