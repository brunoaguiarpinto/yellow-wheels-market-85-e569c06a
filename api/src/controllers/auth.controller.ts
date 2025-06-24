import { Request, Response } from 'express';
import { db } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../services/email.service';

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

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'O e-mail é obrigatório.' });
  }

  try {
    const userResult = await db.query('SELECT * FROM employees WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      // Propositalmente não informamos que o usuário não foi encontrado por segurança
      return res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de redefinição de senha será enviado.' });
    }

    const user = userResult.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

    await db.query(
      'UPDATE employees SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
      [resetToken, passwordResetExpires, user.id]
    );

    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ message: 'Se um usuário com este e-mail existir, um link de redefinição de senha será enviado.' });
  } catch (error) {
    console.error('Erro em forgotPassword:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'A nova senha é obrigatória.' });
  }

  try {
    const userResult = await db.query(
      'SELECT * FROM employees WHERE password_reset_token = $1 AND password_reset_expires > NOW()',
      [token]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    const user = userResult.rows[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'UPDATE employees SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (error) {
    console.error('Erro em resetPassword:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
