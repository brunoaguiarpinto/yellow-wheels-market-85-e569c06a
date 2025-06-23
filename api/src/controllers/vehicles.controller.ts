import { Request, Response } from 'express';
import { vehicleService } from '../services/vehicle.service';

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.findAll();
    res.json(vehicles);
  } catch (error) {
    console.error('Erro ao buscar veículos:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const vehicle = await vehicleService.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Veículo não encontrado.' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error(`Erro ao buscar veículo com id ${id}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
