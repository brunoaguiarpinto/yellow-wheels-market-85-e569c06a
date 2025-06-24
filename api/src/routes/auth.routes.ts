import { Router } from 'express';
import { login, forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
