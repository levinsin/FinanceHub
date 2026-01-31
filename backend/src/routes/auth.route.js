import express from 'express';
import { checkEmail, login, register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/check-email', checkEmail);
router.post('/login', login);
router.post('/register', register);

export default router;
