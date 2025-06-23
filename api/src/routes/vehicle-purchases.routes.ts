import { Router } from 'express';
import { createVehiclePurchase, getAllVehiclePurchases } from '../controllers/vehicle-purchases.controller';

const router = Router();

router.get('/', getAllVehiclePurchases);
router.post('/', createVehiclePurchase);

export default router;
