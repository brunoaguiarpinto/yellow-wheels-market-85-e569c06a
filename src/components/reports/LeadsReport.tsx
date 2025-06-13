
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ReportFilter, LeadReport } from "@/types/reports";
import { Users, TrendingUp, Target, Percent } from "lucide-react";

interface LeadsReportProps {
  filters: ReportFilter;
}

const LeadsReport = ({ filters }: LeadsReportProps) => {
  const [reportData, setReportData] = useState<LeadReport>({
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    leadsByOrigin: [],
    leadsByPeriod: []
  });

  useEffect(() => {
    // Simular dados do relatório de leads
    const mockData: LeadReport = {
      totalLeads: 45,
      convertedLeads: 12,
      conversionRate: 26.7,
      leadsByOrigin: [
        { origin: "Website", count: 18, converted: 5, conversionRate: 27.8 },
        { origin: "Indicação", count: 15, converted: 4, conversionRate: 26.7 },
        { origin: "Redes Sociais", count: 8, converted: 2, conversionRate: 25.0 },
        { origin: "Telefone", count: 4, converted: 1, conversionRate: 25.0 }
      ],
      leadsByPeriod: [
        { period: "Janeiro", leads: 12, sales: 3, revenue: 240000 },
        { period: "Fevereiro", leads: 15, sales: 4, revenue: 320000 },
        { period: "Março", leads: 18, sales: 5, revenue: 400000 }
      ]
    };

    setReportData(mockData);
  }, [filters]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold">{reportData.totalLeads}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Convertidos</p>
                <p className="text-2xl font-bold">{reportData.convertedLeads}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold">{reportData.conversionRate}%</p>
              </div>
              <Percent className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Perdidos</p>
                <p className="text-2xl font-bold">{reportData.totalLeads - reportData.convertedLeads}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Leads por Origem */}
        <Card>
          <CardHeader>
            <CardTitle>Leads por Origem</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportData.leadsByOrigin}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {reportData.leadsByOrigin.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Performance por Período */}
        <Card>
          <CardHeader>
            <CardTitle>Performance por Período</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.leadsByPeriod}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#8884d8" name="Leads" />
                <Bar dataKey="sales" fill="#82ca9d" name="Vendas" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Detalhes por Origem */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes por Origem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Origem</th>
                  <th className="text-right p-2">Total Leads</th>
                  <th className="text-right p-2">Convertidos</th>
                  <th className="text-right p-2">Taxa de Conversão</th>
                </tr>
              </thead>
              <tbody>
                {reportData.leadsByOrigin.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.origin}</td>
                    <td className="text-right p-2">{item.count}</td>
                    <td className="text-right p-2">{item.converted}</td>
                    <td className="text-right p-2">{item.conversionRate.toFixed(1)}%</td>
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

export default LeadsReport;
