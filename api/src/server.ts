import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

import authRoutes from './routes/auth.routes';
import vehicleRoutes from './routes/vehicles.routes';
import customerRoutes from './routes/customers.routes';
import employeeRoutes from './routes/employees.routes';
import interactionRoutes from './routes/interactions.routes';
import fixedCostRoutes from './routes/fixed-costs.routes';
import contractRoutes from './routes/contracts.routes';
import reportRoutes from './routes/reports.routes';
import vehiclePurchaseRoutes from './routes/vehicle-purchases.routes';

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/fixed-costs', fixedCostRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/vehicle-purchases', vehiclePurchaseRoutes);


export { app };
