import express from "express";
import { createIncome, getIncomes, updateIncome, deleteIncome } from "../controllers/income.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get('/', getIncomes);
router.post('/', createIncome);
router.get('/:id', getIncomes);
router.put('/:id', updateIncome);
router.delete('/:id', deleteIncome);

export default router;