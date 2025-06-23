import { Router } from 'express';
import { createFixedCost, deleteFixedCost, getAllFixedCosts, updateFixedCost } from '../controllers/fixed-costs.controller';

const router = Router();

router.get('/', getAllFixedCosts);
router.post('/', createFixedCost);
router.put('/:id', updateFixedCost);
router.delete('/:id', deleteFixedCost);

export default router;
