import { Request, Response } from 'express';
import { customerService } from '../services/customer.service';

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await customerService.findAll();
    res.json(customers);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const customer = await customerService.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.json(customer);
  } catch (error) {
    console.error(`Erro ao buscar cliente com id ${id}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const newCustomer = await customerService.create(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedCustomer = await customerService.update(id, req.body);
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.json(updatedCustomer);
  } catch (error) {
    console.error(`Erro ao atualizar cliente com id ${id}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await customerService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`Erro ao deletar cliente com id ${id}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
