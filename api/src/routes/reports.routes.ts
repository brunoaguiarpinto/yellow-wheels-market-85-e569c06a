import { Router } from 'express';
import { getFinancialReport } from '../controllers/reports.controller';

const router = Router();

router.get('/financial', getFinancialReport);

export default router;
