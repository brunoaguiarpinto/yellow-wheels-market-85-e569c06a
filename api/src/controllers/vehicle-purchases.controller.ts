import { Request, Response } from 'express';
import { vehiclePurchaseService } from '../services/vehicle-purchase.service';

export const getAllVehiclePurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await vehiclePurchaseService.findAll();
    res.json(purchases);
  } catch (error) {
    console.error('Erro ao buscar compras de veículos:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const createVehiclePurchase = async (req: Request, res: Response) => {
  try {
    const newPurchase = await vehiclePurchaseService.create(req.body);
    res.status(201).json(newPurchase);
  } catch (error) {
    console.error('Erro ao criar compra de veículo:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
