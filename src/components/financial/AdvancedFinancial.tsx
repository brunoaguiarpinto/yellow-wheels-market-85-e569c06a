
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Plus, Calendar } from "lucide-react";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import SalesFinancialManager from "./SalesFinancialManager";
import VehicleCostManager from "./VehicleCostManager";
import FixedCostManager from "./FixedCostManager";
import FinancialReports from "./FinancialReports";

const AdvancedFinancial = () => {
  const { data: sales } = useSupabaseData('sales');
  const { data: vehicleCosts } = useSupabaseData('vehicle_costs');
  const { data: fixedCosts } = useSupabaseData('fixed_costs');

  // Calcular métricas financeiras
  const totalSales = sales.reduce((sum: number, sale: any) => sum + (Number(sale.sale_price) || 0), 0);
  const totalVehicleCosts = vehicleCosts.reduce((sum: number, cost: any) => sum + (Number(cost.amount) || 0), 0);
  const totalFixedCosts = fixedCosts.reduce((sum: number, cost: any) => sum + (Number(cost.amount) || 0), 0);
  const totalCosts = totalVehicleCosts + totalFixedCosts;
  const netProfit = totalSales - totalCosts;
  const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100) : 0;

  // Vendas do mês atual
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthSales = sales.filter((sale: any) => {
    const saleDate = new Date(sale.sale_date);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });
  const monthlyRevenue = currentMonthSales.reduce((sum: number, sale: any) => sum + (Number(sale.sale_price) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Módulo Financeiro Avançado</h2>
        <p className="text-gray-600">Controle financeiro completo da concessionária</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSales)}
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
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Receita do Mês</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyRevenue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores de Performance */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Margem de Lucro</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Badge className={profitMargin >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {profitMargin.toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Vendas no Mês</p>
            <p className="text-2xl font-bold mt-2">{currentMonthSales.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
            <p className="text-2xl font-bold mt-2">
              {sales.length > 0 
                ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSales / sales.length)
                : 'R$ 0,00'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Financeiros */}
      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="vehicle-costs">Custos Veículos</TabsTrigger>
          <TabsTrigger value="fixed-costs">Custos Fixos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <SalesFinancialManager />
        </TabsContent>

        <TabsContent value="vehicle-costs">
          <VehicleCostManager />
        </TabsContent>

        <TabsContent value="fixed-costs">
          <FixedCostManager />
        </TabsContent>

        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedFinancial;
