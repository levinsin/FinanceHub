import { Router } from 'express';
import { loginUser, logoutuser, registerUser, checkEmail } from '../controllers/user.controller.js';

const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutuser);
router.route('/check-email').post(checkEmail);


export default router;