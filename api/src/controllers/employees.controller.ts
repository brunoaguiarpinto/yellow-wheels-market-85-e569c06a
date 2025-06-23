import { Request, Response } from 'express';
import { employeeService } from '../services/employee.service';

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await employeeService.findAll();
    res.json(employees);
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const employee = await employeeService.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
    res.json(employee);
  } catch (error) {
    console.error(`Erro ao buscar funcionário com id ${id}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const newEmployee = await employeeService.create(req.body);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error('Erro ao criar funcionário:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedEmployee = await employeeService.update(id, req.body);
    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    console.error(`Erro ao atualizar funcionário com id ${id}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deleted = await employeeService.delete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`Erro ao deletar funcionário com id ${id}:`, error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
