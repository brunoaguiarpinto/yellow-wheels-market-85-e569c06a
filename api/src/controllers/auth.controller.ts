import { Request, Response } from 'express';
import { db } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  try {
    const userResult = await db.query('SELECT * FROM employees WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'supersecretkey', // Em um app real, use uma variável de ambiente forte
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login bem-sucedido!',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
