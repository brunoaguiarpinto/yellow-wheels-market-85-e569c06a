import { Request, Response } from 'express';
import { reportService } from '../services/report.service';

export const getFinancialReport = async (req: Request, res: Response) => {
  try {
    const report = await reportService.generateFinancialReport();
    res.json(report);
  } catch (error) {
    console.error('Erro ao gerar relatório financeiro:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
