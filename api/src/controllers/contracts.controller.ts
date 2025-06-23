import { Request, Response } from 'express';
import { contractService } from '../services/contract.service';

export const getAllContracts = async (req: Request, res: Response) => {
  try {
    const contracts = await contractService.findAll();
    res.json(contracts);
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getContractById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const contract = await contractService.findById(id);
    if (!contract) {
      return res.status(404).json({ message: 'Contrato não encontrado.' });
    }
    res.json(contract);
  } catch (error) {
    console.error(`Erro ao buscar contrato com id ${id}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const createContract = async (req: Request, res: Response) => {
  try {
    const newContract = await contractService.create(req.body);
    res.status(201).json(newContract);
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const updateContract = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedContract = await contractService.update(id, req.body);
    if (!updatedContract) {
      return res.status(404).json({ message: 'Contrato não encontrado.' });
    }
    res.json(updatedContract);
  } catch (error) {
    console.error(`Erro ao atualizar contrato com id ${id}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
