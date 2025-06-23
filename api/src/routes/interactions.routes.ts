import { Router } from 'express';
import { createInteraction, getInteractionsByCustomer } from '../controllers/interactions.controller';

const router = Router();

router.get('/customer/:customerId', getInteractionsByCustomer);
router.post('/', createInteraction);

export default router;
