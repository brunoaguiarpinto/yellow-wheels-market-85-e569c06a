import { db } from '../db';

export const vehicleService = {
  findAll: async () => {
    const result = await db.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    return result.rows;
  },

  findById: async (id: string) => {
    const result = await db.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    return result.rows[0] || null;
  },
};
