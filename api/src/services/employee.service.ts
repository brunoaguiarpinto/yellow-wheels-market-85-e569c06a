// @ts-nocheck
import { db } from '../db';
import bcrypt from 'bcrypt';

export const employeeService = {
  findAll: async () => {
    const result = await db.query('SELECT id, name, email, role, is_active FROM employees ORDER BY name ASC');
    return result.rows;
  },

  findById: async (id: string) => {
    const result = await db.query('SELECT id, name, email, role, is_active FROM employees WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  create: async (employeeData) => {
    const { name, email, password, role, is_active = true } = employeeData;
    
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO employees (name, email, password_hash, role, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, is_active;
    `;
    const values = [name, email, password_hash, role, is_active];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  update: async (id: string, employeeData) => {
    const { name, email, password, role, is_active } = employeeData;
    
    let password_hash;
    if (password) {
      const saltRounds = 10;
      password_hash = await bcrypt.hash(password, saltRounds);
    }

    // Lógica para construir a query dinamicamente
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) { fields.push(`name = $${paramCount++}`); values.push(name); }
    if (email !== undefined) { fields.push(`email = $${paramCount++}`); values.push(email); }
    if (password_hash !== undefined) { fields.push(`password_hash = $${paramCount++}`); values.push(password_hash); }
    if (role !== undefined) { fields.push(`role = $${paramCount++}`); values.push(role); }
    if (is_active !== undefined) { fields.push(`is_active = $${paramCount++}`); values.push(is_active); }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = now()`);
    
    const query = `
      UPDATE employees
      SET ${fields.join(', ')}
      WHERE id = $${paramCount++}
      RETURNING id, name, email, role, is_active;
    `;
    
    values.push(id);
    const result = await db.query(query, values);
    return result.rows[0] || null;
  },

  delete: async (id: string) => {
    const result = await db.query('DELETE FROM employees WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  },
};
