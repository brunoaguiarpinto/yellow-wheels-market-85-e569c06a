// @ts-nocheck
import { db } from '../db';

export const fixedCostService = {
  findAll: async () => {
    const result = await db.query('SELECT * FROM fixed_costs ORDER BY created_at DESC');
    return result.rows;
  },

  create: async (costData) => {
    const { category, description, amount, frequency, due_date, is_recurring, status } = costData;
    const query = `
      INSERT INTO fixed_costs (category, description, amount, frequency, due_date, is_recurring, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [category, description, amount, frequency, due_date, is_recurring, status];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  update: async (id, costData) => {
    const { category, description, amount, frequency, due_date, is_recurring, status } = costData;
    const query = `
      UPDATE fixed_costs
      SET category = $1, description = $2, amount = $3, frequency = $4, 
          due_date = $5, is_recurring = $6, status = $7, updated_at = now()
      WHERE id = $8
      RETURNING *;
    `;
    const values = [category, description, amount, frequency, due_date, is_recurring, status, id];
    const result = await db.query(query, values);
    return result.rows[0] || null;
  },

  delete: async (id) => {
    const result = await db.query('DELETE FROM fixed_costs WHERE id = $1', [id]);
    return (result.rowCount || 0) > 0;
  },
};
