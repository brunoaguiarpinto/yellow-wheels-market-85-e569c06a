
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useSupabaseData } from "@/hooks/useSupabaseData";

const FinancialReports = () => {
  const [reportType, setReportType] = useState("overview");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: sales } = useSupabaseData('sales');
  const { data: vehicleCosts } = useSupabaseData('vehicle_costs');
  const { data: fixedCosts } = useSupabaseData('fixed_costs');

  // Filtrar dados por período se especificado
  const filteredSales = sales.filter((sale: any) => {
    if (!dateFrom || !dateTo) return true;
    const saleDate = new Date(sale.sale_date);
    return saleDate >= new Date(dateFrom) && saleDate <= new Date(dateTo);
  });

  // Métricas gerais
  const totalRevenue = filteredSales.reduce((sum: number, sale: any) => sum + (Number(sale.sale_price) || 0), 0);
  const totalVehicleCosts = vehicleCosts.reduce((sum: number, cost: any) => sum + (Number(cost.amount) || 0), 0);
  const totalFixedCosts = fixedCosts.reduce((sum: number, cost: any) => sum + (Number(cost.amount) || 0), 0);
  const totalCosts = totalVehicleCosts + totalFixedCosts;
  const netProfit = totalRevenue - totalCosts;

  // Dados para gráficos
  const monthlyData = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleString('pt-BR', { month: 'short' });
    
    const monthSales = sales.filter((sale: any) => {
      const saleDate = new Date(sale.sale_date);
      return saleDate.getMonth() === date.getMonth() && saleDate.getFullYear() === date.getFullYear();
    });
    
    const revenue = monthSales.reduce((sum: number, sale: any) => sum + (Number(sale.sale_price) || 0), 0);
    
    monthlyData.push({
      month,
      revenue,
      sales: monthSales.length
    });
  }

  // Dados para gráfico de custos
  const costData = [
    { name: 'Custos de Veículos', value: totalVehicleCosts, color: '#8884d8' },
    { name: 'Custos Fixos', value: totalFixedCosts, color: '#82ca9d' },
  ];

  // Relatório de vendas por forma de pagamento
  const paymentMethodData = sales.reduce((acc: any, sale: any) => {
    const method = sale.payment_method || 'Não informado';
    if (!acc[method]) {
      acc[method] = { count: 0, total: 0 };
    }
    acc[method].count++;
    acc[method].total += Number(sale.sale_price) || 0;
    return acc;
  }, {});

  const paymentMethodChart = Object.entries(paymentMethodData).map(([method, data]: [string, any]) => ({
    method,
    count: data.count,
    total: data.total
  }));

  const exportReport = () => {
    const reportData = {
      period: dateFrom && dateTo ? `${dateFrom} a ${dateTo}` : 'Todos os períodos',
      totalRevenue,
      totalCosts,
      netProfit,
      salesCount: filteredSales.length,
      averageTicket: filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0,
      profitMargin: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100) : 0
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Relatórios Financeiros</h3>
          <p className="text-gray-600">Análise detalhada da performance financeira</p>
        </div>
        <Button onClick={exportReport} className="flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Exportar Relatório</span>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="reportType">Tipo de Relatório</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Visão Geral</SelectItem>
                  <SelectItem value="sales">Vendas</SelectItem>
                  <SelectItem value="costs">Custos</SelectItem>
                  <SelectItem value="profit">Lucratividade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateFrom">Data Início</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">Data Fim</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Custos Totais</p>
                <p className="text-2xl font-bold text-red-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCosts)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className={`h-8 w-8 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              <div>
                <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(netProfit)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Vendas no Período</p>
              <p className="text-2xl font-bold">{filteredSales.length}</p>
              <Badge className={netProfit >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                Margem: {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Receita Mensal */}
        <Card>
          <CardHeader>
            <CardTitle>Receita por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [
                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
                    'Receita'
                  ]}
                />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição de Custos */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Custos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {costData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [
                    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value),
                    'Valor'
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vendas por Forma de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethodChart.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{item.method}</p>
                    <p className="text-sm text-gray-600">{item.count} vendas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Evolução de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Número de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#82ca9d" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReports;
