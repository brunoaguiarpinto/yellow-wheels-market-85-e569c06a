import { Request, Response } from 'express';
import { interactionService } from '../services/interaction.service';

export const getInteractionsByCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  try {
    const interactions = await interactionService.findByCustomerId(customerId);
    res.json(interactions);
  } catch (error) {
    console.error(`Erro ao buscar interações para o cliente ${customerId}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const createInteraction = async (req: Request, res: Response) => {
  try {
    const newInteraction = await interactionService.create(req.body);
    res.status(201).json(newInteraction);
  } catch (error) {
    console.error('Erro ao criar interação:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
