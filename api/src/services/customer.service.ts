// @ts-nocheck
import { db } from '../db';

// Duplicando a interface para desacoplar o backend do frontend
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  cpf?: string;
  rg?: string;
  birth_date?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  origin?: string;
  status?: string;
  vehicle_interest?: string;
  price_range?: string;
  financing_interest?: boolean;
  priority?: string;
  assigned_employee_id?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}


export const customerService = {
  findAll: async () => {
    const result = await db.query('SELECT * FROM customers ORDER BY created_at DESC');
    return result.rows;
  },

  findById: async (id: string) => {
    const result = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  create: async (customerData: Partial<Customer>) => {
    const {
      name, email, phone, whatsapp, cpf, rg, birth_date, address,
      number, complement, neighborhood, city, state, zip_code,
      origin, status, vehicle_interest, price_range, financing_interest,
      priority, assigned_employee_id, observations
    } = customerData;

    const query = `
      INSERT INTO customers (
        name, email, phone, whatsapp, cpf, rg, birth_date, address,
        "number", complement, neighborhood, city, state, zip_code,
        origin, status, vehicle_interest, price_range, financing_interest,
        priority, assigned_employee_id, observations
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22
      ) RETURNING *;
    `;

    const values = [
      name, email, phone, whatsapp, cpf, rg, birth_date, address,
      number, complement, neighborhood, city, state, zip_code,
      origin, status, vehicle_interest, price_range, financing_interest,
      priority, assigned_employee_id, observations
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  },

  update: async (id: string, customerData: Partial<Customer>) => {
    const existingCustomer = await this.findById(id);
    if (!existingCustomer) {
      return null;
    }

    const updatePayload = { ...existingCustomer, ...customerData };

    const query = `
      UPDATE customers
      SET 
        name = $1, email = $2, phone = $3, whatsapp = $4, cpf = $5, rg = $6, birth_date = $7,
        address = $8, "number" = $9, complement = $10, neighborhood = $11, city = $12,
        state = $13, zip_code = $14, origin = $15, status = $16, vehicle_interest = $17,
        price_range = $18, financing_interest = $19, priority = $20,
        assigned_employee_id = $21, observations = $22, updated_at = now()
      WHERE id = $23
      RETURNING *;
    `;

    const values = [
      updatePayload.name, updatePayload.email, updatePayload.phone, updatePayload.whatsapp,
      updatePayload.cpf, updatePayload.rg, updatePayload.birth_date, updatePayload.address,
      updatePayload.number, updatePayload.complement, updatePayload.neighborhood,
      updatePayload.city, updatePayload.state, updatePayload.zip_code, updatePayload.origin,
      updatePayload.status, updatePayload.vehicle_interest, updatePayload.price_range,
      updatePayload.financing_interest, updatePayload.priority, updatePayload.assigned_employee_id,
      updatePayload.observations, id
    ];

    const result = await db.query(query, values);
    return result.rows[0] || null;
  },

  delete: async (id: string) => {
    const result = await db.query('DELETE FROM customers WHERE id = $1 RETURNING id', [id]);
    return (result.rowCount || 0) > 0;
  },
};
