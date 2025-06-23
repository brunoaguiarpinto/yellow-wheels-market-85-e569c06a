import { Router } from 'express';
import { getAllVehicles, getVehicleById } from '../controllers/vehicles.controller';

const router = Router();

router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);

export default router;
