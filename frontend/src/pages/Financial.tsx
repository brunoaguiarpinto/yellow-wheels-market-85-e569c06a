import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "@/hooks/use-toast";
import VehiclePurchaseForm from "@/components/financial/VehiclePurchaseForm";
import VehicleStatusManager from "@/components/financial/VehicleStatusManager";
import SalesForm from "@/components/financial/SalesForm";
import FixedCostsManager from "@/components/financial/FixedCostsManager";
import { DollarSign, ShoppingCart, TrendingUp, AlertCircle, Lock, Plus, Car } from "lucide-react";
import { Vehicle, VehiclePurchase } from "@/types/vehicle";
import { Contract } from "@/types/contracts";

const Financial = () => {
  const { user, isAuthenticated } = useAuth();
  const { canViewFinancial, canCreatePurchases, canViewAnalysis, canManageInventory, canViewSales, canCreateSales } = usePermissions();
  const { toast } = useToast();
  
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);

  const { data: vehicles = [] } = useQuery<Vehicle[]>({ queryKey: ['vehicles'], queryFn: () => api.get('/vehicles').then(res => res.data) });
  const { data: purchases = [] } = useQuery<VehiclePurchase[]>({ queryKey: ['vehiclePurchases'], queryFn: () => api.get('/vehicle-purchases').then(res => res.data) });
  const { data: sales = [] } = useQuery<Contract[]>({ queryKey: ['sales'], queryFn: () => api.get('/contracts?status=signed').then(res => res.data) });

  if (!isAuthenticated || !user) {
    return <div>Acesso Restrito</div>;
  }
  if (!canViewFinancial) {
    return <div>Acesso Negado</div>;
  }

  const totalPurchaseValue = purchases.reduce((sum, purchase) => sum + purchase.purchasePrice, 0);
  const totalSalesValue = sales.reduce((sum, sale) => sum + sale.salePrice, 0);
  const grossProfit = totalSalesValue - totalPurchaseValue;
  const profitMargin = totalSalesValue > 0 ? (grossProfit / totalSalesValue) * 100 : 0;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-montserrat mb-2">Gestão Financeira</h2>
        <p className="text-gray-600 font-opensans">Controle de compras, vendas e análise de margem de lucro</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* ... (cards) */}
      </div>

      <Tabs defaultValue="purchases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="purchases">Compras</TabsTrigger>
          <TabsTrigger value="sales" disabled={!canViewSales}>Vendas</TabsTrigger>
          <TabsTrigger value="inventory" disabled={!canManageInventory}>Estoque</TabsTrigger>
          <TabsTrigger value="fixed-costs">Custos Fixos</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!canViewAnalysis}>Análise</TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold font-montserrat">Compras de Veículos</h3>
            <Button onClick={() => setShowPurchaseForm(true)} disabled={!canCreatePurchases}>
              <Plus className="h-4 w-4 mr-2" /> Nova Compra
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              {purchases.length === 0 ? <p>Nenhuma compra registrada.</p> : (
                <div className="space-y-4">
                  {purchases.map((purchase) => {
                    const vehicle = vehicles.find((v) => v.id === purchase.vehicleId);
                    return (
                      <div key={purchase.id} className="border rounded-lg p-4">
                        <p>{vehicle?.brand} {vehicle?.model}</p>
                        <p>Fornecedor: {purchase.supplier}</p>
                        <p>Preço: R$ {purchase.purchasePrice.toLocaleString()}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          <Dialog open={showPurchaseForm} onOpenChange={setShowPurchaseForm}>
            <DialogContent className="max-w-4xl">
              <DialogHeader><DialogTitle>Registrar Compra de Veículo</DialogTitle></DialogHeader>
              <VehiclePurchaseForm onSubmit={() => setShowPurchaseForm(false)} onCancel={() => setShowPurchaseForm(false)} />
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="sales">
          {/* ... (conteúdo da aba de vendas) */}
        </TabsContent>

        <TabsContent value="inventory">
          {/* ... (conteúdo da aba de estoque) */}
        </TabsContent>

        <TabsContent value="fixed-costs">
          <FixedCostsManager />
        </TabsContent>

        <TabsContent value="analysis">
          {/* ... (conteúdo da aba de análise) */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financial;
