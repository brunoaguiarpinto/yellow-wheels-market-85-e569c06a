import { Request, Response } from 'express';
import { fixedCostService } from '../services/fixed-cost.service';

export const getAllFixedCosts = async (req: Request, res: Response) => {
  try {
    const costs = await fixedCostService.findAll();
    res.json(costs);
  } catch (error) {
    console.error('Erro ao buscar custos fixos:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const createFixedCost = async (req: Request, res: Response) => {
  try {
    const newCost = await fixedCostService.create(req.body);
    res.status(201).json(newCost);
  } catch (error) {
    console.error('Erro ao criar custo fixo:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const updateFixedCost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedCost = await fixedCostService.update(id, req.body);
    if (!updatedCost) {
      return res.status(404).json({ message: 'Custo fixo não encontrado.' });
    }
    res.json(updatedCost);
  } catch (error) {
    console.error(`Erro ao atualizar custo fixo com id ${id}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const deleteFixedCost = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await fixedCostService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Custo fixo não encontrado.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`Erro ao deletar custo fixo com id ${id}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
