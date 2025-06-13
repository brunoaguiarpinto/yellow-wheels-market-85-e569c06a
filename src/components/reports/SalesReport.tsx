
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { ReportFilter, SalesReport as SalesReportType } from "@/types/reports";
import { DollarSign, TrendingUp, Users, ShoppingCart } from "lucide-react";

interface SalesReportProps {
  filters: ReportFilter;
}

const SalesReport = ({ filters }: SalesReportProps) => {
  const [reportData, setReportData] = useState<SalesReportType>({
    totalSales: 0,
    totalRevenue: 0,
    averageTicket: 0,
    salesByEmployee: [],
    salesByVehicleType: [],
    salesByPeriod: []
  });

  useEffect(() => {
    // Simular dados do relatório de vendas
    const mockData: SalesReportType = {
      totalSales: 12,
      totalRevenue: 960000,
      averageTicket: 80000,
      salesByEmployee: [
        { employeeId: "1", employeeName: "Maria Santos", totalSales: 5, totalRevenue: 400000, averageTicket: 80000, conversionRate: 27.8 },
        { employeeId: "2", employeeName: "Carlos Lima", totalSales: 4, totalRevenue: 320000, averageTicket: 80000, conversionRate: 26.7 },
        { employeeId: "3", employeeName: "Ana Silva", totalSales: 3, totalRevenue: 240000, averageTicket: 80000, conversionRate: 25.0 }
      ],
      salesByVehicleType: [
        { brand: "Honda", model: "Civic", count: 3, revenue: 240000, averagePrice: 80000 },
        { brand: "Toyota", model: "Corolla", count: 4, revenue: 320000, averagePrice: 80000 },
        { brand: "Volkswagen", model: "Jetta", count: 2, revenue: 160000, averagePrice: 80000 },
        { brand: "Ford", model: "Focus", count: 3, revenue: 240000, averagePrice: 80000 }
      ],
      salesByPeriod: [
        { period: "Janeiro", leads: 12, sales: 3, revenue: 240000 },
        { period: "Fevereiro", leads: 15, sales: 4, revenue: 320000 },
        { period: "Março", leads: 18, sales: 5, revenue: 400000 }
      ]
    };

    setReportData(mockData);
  }, [filters]);

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Vendas</p>
                <p className="text-2xl font-bold">{reportData.totalSales}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    notation: 'compact'
                  }).format(reportData.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    notation: 'compact'
                  }).format(reportData.averageTicket)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendedores Ativos</p>
                <p className="text-2xl font-bold">{reportData.salesByEmployee.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance por Vendedor */}
        <Card>
          <CardHeader>
            <CardTitle>Performance por Vendedor</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.salesByEmployee}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="employeeName" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'totalSales' ? value : 
                  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value)),
                  name === 'totalSales' ? 'Vendas' : 'Receita'
                ]} />
                <Bar dataKey="totalSales" fill="#8884d8" name="Vendas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendas por Período */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução das Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData.salesByPeriod}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'sales' ? value : 
                  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value)),
                  name === 'sales' ? 'Vendas' : 'Receita'
                ]} />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Vendas" />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Receita" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vendas por Tipo de Veículo */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas por Modelo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Marca</th>
                  <th className="text-left p-2">Modelo</th>
                  <th className="text-right p-2">Quantidade</th>
                  <th className="text-right p-2">Receita</th>
                  <th className="text-right p-2">Preço Médio</th>
                </tr>
              </thead>
              <tbody>
                {reportData.salesByVehicleType.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.brand}</td>
                    <td className="p-2">{item.model}</td>
                    <td className="text-right p-2">{item.count}</td>
                    <td className="text-right p-2">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.revenue)}
                    </td>
                    <td className="text-right p-2">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.averagePrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesReport;
