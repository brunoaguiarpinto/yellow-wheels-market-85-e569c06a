// @ts-nocheck
import { db } from '../db';

export const contractService = {
  findAll: async () => {
    const result = await db.query('SELECT * FROM contracts ORDER BY created_at DESC');
    return result.rows;
  },

  findById: async (id: string) => {
    const result = await db.query('SELECT * FROM contracts WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  create: async (contractData) => {
    const { 
      contract_number, customer_id, vehicle_id, employee_id, status, 
      contract_type, sale_price, clauses, payment_terms, 
      trade_in_vehicle, observations, signed_at 
    } = contractData;
    
    const query = `
      INSERT INTO contracts (
        contract_number, customer_id, vehicle_id, employee_id, status, 
        contract_type, sale_price, clauses, payment_terms, 
        trade_in_vehicle, observations, signed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const values = [
      contract_number, customer_id, vehicle_id, employee_id, status, 
      contract_type, sale_price, JSON.stringify(clauses), JSON.stringify(payment_terms), 
      JSON.stringify(trade_in_vehicle), observations, signed_at
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  update: async (id, contractData) => {
    const { 
      status, sale_price, clauses, payment_terms, 
      trade_in_vehicle, observations, signed_at 
    } = contractData;

    const query = `
      UPDATE contracts
      SET 
        status = $1, sale_price = $2, clauses = $3, payment_terms = $4, 
        trade_in_vehicle = $5, observations = $6, signed_at = $7, updated_at = now()
      WHERE id = $8
      RETURNING *;
    `;
    const values = [
      status, sale_price, JSON.stringify(clauses), JSON.stringify(payment_terms), 
      JSON.stringify(trade_in_vehicle), observations, signed_at, id
    ];
    const result = await db.query(query, values);
    return result.rows[0] || null;
  },
};
