import { Router } from 'express';
import { createContract, getAllContracts, getContractById, updateContract } from '../controllers/contracts.controller';

const router = Router();

router.get('/', getAllContracts);
router.get('/:id', getContractById);
router.post('/', createContract);
router.put('/:id', updateContract);

export default router;
