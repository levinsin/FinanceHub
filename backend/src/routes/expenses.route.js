import express from 'express';
import {
  createExpense, getExpenses, updateExpense, deleteExpense
} from '../controllers/expenses.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getExpenses);
router.post('/', createExpense);
// router.get('/:id', getExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;