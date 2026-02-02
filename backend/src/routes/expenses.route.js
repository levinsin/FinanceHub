import express from 'express';
import {
  createExpense, getExpenses, getExpense, updateExpense, deleteExpense
} from '../controllers/expenses.controller.js';

const router = express.Router();

router.get('/', getExpenses);
router.post('/', createExpense);
router.get('/:id', getExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;