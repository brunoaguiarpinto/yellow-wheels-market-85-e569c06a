// @ts-nocheck
import { db } from '../db';

export const vehiclePurchaseService = {
  findAll: async () => {
    const result = await db.query('SELECT * FROM vehicle_purchases ORDER BY purchase_date DESC');
    return result.rows;
  },

  create: async (purchaseData) => {
    const { 
      vehicle_id, supplier, purchase_price, purchase_date, 
      condition, documentation, notes, employee_id 
    } = purchaseData;
    
    const query = `
      INSERT INTO vehicle_purchases (
        vehicle_id, supplier, purchase_price, purchase_date, 
        condition, documentation, notes, employee_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      vehicle_id, supplier, purchase_price, purchase_date, 
      condition, documentation, notes, employee_id
    ];
    const result = await db.query(query, values);
    
    // Atualiza o status do veículo para 'purchased' ou 'available'
    await db.query("UPDATE vehicles SET status = 'available' WHERE id = $1", [vehicle_id]);

    return result.rows[0];
  },
};
