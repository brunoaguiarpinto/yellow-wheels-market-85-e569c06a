// @ts-nocheck
import { db } from '../db';

export const interactionService = {
  findByCustomerId: async (customerId: string) => {
    const query = `
      SELECT i.*, e.name as employee_name 
      FROM interactions i
      JOIN employees e ON i.employee_id = e.id
      WHERE i.customer_id = $1 
      ORDER BY i.created_at DESC
    `;
    const result = await db.query(query, [customerId]);
    return result.rows;
  },

  create: async (interactionData) => {
    const { customer_id, type, description, result, follow_up_date, employee_id } = interactionData;
    
    const query = `
      INSERT INTO interactions (customer_id, type, description, result, follow_up_date, employee_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [customer_id, type, description, result, follow_up_date, employee_id];
    const dbResult = await db.query(query, values);
    return dbResult.rows[0];
  },
};
