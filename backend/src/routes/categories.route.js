import express from 'express';
import {
  createCategory, getCategories, deleteCategory
} from '../controllers/categories.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all category routes
router.use(authMiddleware);

router.get('/', getCategories);
router.post('/', createCategory);
// router.get('/:id', getCategory);
// router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;