import express from 'express';
import {
  createSavingsGoal, getSavingsGoals, updateSavingsGoal, deleteSavingsGoal
} from '../controllers/savingsGoal.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getSavingsGoals);
router.post('/', createSavingsGoal);
router.put('/:id', updateSavingsGoal);
router.delete('/:id', deleteSavingsGoal);

export default router;