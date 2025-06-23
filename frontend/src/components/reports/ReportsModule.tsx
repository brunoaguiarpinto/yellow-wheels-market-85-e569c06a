
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import ReportFilters from "./ReportFilters";
import LeadsReport from "./LeadsReport";
import SalesReport from "./SalesReport";
import FinancialReport from "./FinancialReport";
import { ReportFilter } from "@/types/reports";

const ReportsModule = () => {
  const [filters, setFilters] = useState<ReportFilter>({});
  const [activeTab, setActiveTab] = useState("leads");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Relatórios Gerenciais</h2>
        <p className="text-gray-600">Análise completa de desempenho e resultados</p>
      </div>

      <ReportFilters filters={filters} onFiltersChange={setFilters} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leads" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Leads</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Vendas</span>
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Financeiro</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <LeadsReport filters={filters} />
        </TabsContent>

        <TabsContent value="sales">
          <SalesReport filters={filters} />
        </TabsContent>

        <TabsContent value="financial">
          <FinancialReport filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsModule;
