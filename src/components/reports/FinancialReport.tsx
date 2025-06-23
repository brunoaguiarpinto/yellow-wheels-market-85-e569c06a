import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ReportFilter, FinancialReport as FinancialReportType } from "@/types/reports";
import { DollarSign, TrendingUp, TrendingDown, Percent } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FinancialReportProps {
  filters: ReportFilter;
}

const fetchFinancialReport = async (filters: ReportFilter): Promise<FinancialReportType> => {
  // Os filtros podem ser passados como query params para a API
  const { data } = await api.get('/reports/financial', { params: filters });
  return data;
};

const FinancialReport = ({ filters }: FinancialReportProps) => {
  const { data: reportData, isLoading, isError } = useQuery<FinancialReportType>({
    queryKey: ['financialReport', filters],
    queryFn: () => fetchFinancialReport(filters),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (isError || !reportData) {
    return <p>Erro ao carregar o relatório.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(reportData.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Custos Totais</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(reportData.totalCosts)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lucro Líquido</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(reportData.netProfit)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Margem de Lucro</p>
                <p className="text-2xl font-bold">{reportData.profitMargin.toFixed(1)}%</p>
              </div>
              <Percent className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Lucratividade por Veículo */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Lucratividade por Veículo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.vehicleAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vehicleName" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value, name) => [ new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value)), name === 'salePrice' ? 'Preço de Venda' : name === 'totalCosts' ? 'Custos Totais' : 'Lucro' ]} />
              <Bar dataKey="salePrice" fill="#8884d8" name="Preço de Venda" />
              <Bar dataKey="totalCosts" fill="#ff7300" name="Custos Totais" />
              <Bar dataKey="profit" fill="#82ca9d" name="Lucro" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento por Veículo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Veículo</th>
                  <th className="text-right p-2">Preço de Venda</th>
                  <th className="text-right p-2">Custos Totais</th>
                  <th className="text-right p-2">Lucro</th>
                  <th className="text-right p-2">Margem (%)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.vehicleAnalysis.map((item) => (
                  <tr key={item.vehicleId} className="border-b">
                    <td className="p-2">{item.vehicleName}</td>
                    <td className="text-right p-2">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.salePrice)}</td>
                    <td className="text-right p-2">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalCosts)}</td>
                    <td className="text-right p-2">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.profit)}</td>
                    <td className="text-right p-2">
                      <span className={`font-semibold ${ item.profitMargin > 20 ? 'text-green-600' : item.profitMargin > 15 ? 'text-yellow-600' : 'text-red-600' }`}>
                        {item.profitMargin.toFixed(1)}%
                      </span>
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

export default FinancialReport;
