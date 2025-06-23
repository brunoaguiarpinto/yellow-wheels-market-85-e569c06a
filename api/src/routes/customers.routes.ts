import { Router } from 'express';
import { createCustomer, deleteCustomer, getAllCustomers, getCustomerById, updateCustomer } from '../controllers/customers.controller';

const router = Router();

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);

export default router;
