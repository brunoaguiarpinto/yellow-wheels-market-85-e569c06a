import { db } from '../db';

export const reportService = {
  generateFinancialReport: async () => {
    // Esta é uma consulta de exemplo. Em um cenário real, seria mais complexa.
    const totalRevenueResult = await db.query(
      "SELECT SUM(sale_price) as total_revenue FROM contracts WHERE status = 'signed'"
    );
    const totalVehicleCostsResult = await db.query("SELECT SUM(amount) as total_costs FROM vehicle_costs");
    const totalFixedCostsResult = await db.query("SELECT SUM(amount) as total_costs FROM fixed_costs WHERE status = 'paid'");

    const totalRevenue = parseFloat(totalRevenueResult.rows[0]?.total_revenue) || 0;
    const totalVehicleCosts = parseFloat(totalVehicleCostsResult.rows[0]?.total_costs) || 0;
    const totalFixedCosts = parseFloat(totalFixedCostsResult.rows[0]?.total_costs) || 0;
    const totalCosts = totalVehicleCosts + totalFixedCosts;
    const grossProfit = totalRevenue - totalCosts;

    return {
      totalRevenue,
      totalCosts,
      grossProfit,
      netProfit: grossProfit * 0.8, // Exemplo simplificado de lucro líquido
      profitMargin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0,
    };
  },
};
