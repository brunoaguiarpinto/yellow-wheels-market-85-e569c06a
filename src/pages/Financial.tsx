
import { useState } from "react";
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
import VehicleCostManager from "@/components/financial/VehicleCostManager";
import FixedCostsManager from "@/components/financial/FixedCostsManager";
import { DollarSign, ShoppingCart, TrendingUp, AlertCircle, Lock, Plus, Car } from "lucide-react";

const Financial = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    canViewFinancial, 
    canCreatePurchases, 
    canViewAnalysis, 
    canManageInventory,
    canViewSales,
    canCreateSales,
  } = usePermissions();
  const { toast } = useToast();
  
  const [vehicles, setVehicles] = useState(() => JSON.parse(localStorage.getItem('vehicles') || '[]'));
  const [purchases] = useState(() => JSON.parse(localStorage.getItem('vehiclePurchases') || '[]'));
  const [sales, setSales] = useState(() => JSON.parse(localStorage.getItem('sales') || '[]'));
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);

  // Verificação de autenticação e permissões
  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Lock className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Acesso Restrito</h3>
            <p className="text-gray-600">Você precisa estar logado para acessar esta área.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!canViewFinancial) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Lock className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Acesso Negado</h3>
            <p className="text-gray-600">
              Você não tem permissão para acessar o módulo financeiro.
            </p>
            <p className="text-sm text-gray-500">
              Entre em contato com o administrador para solicitar acesso.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const refreshVehicles = () => {
    setVehicles(JSON.parse(localStorage.getItem('vehicles') || '[]'));
  };

  const refreshSales = () => {
    setSales(JSON.parse(localStorage.getItem('sales') || '[]'));
  };

  // Cálculos financeiros básicos
  const totalPurchaseValue = purchases.reduce((sum: number, purchase: any) => sum + purchase.purchasePrice, 0);
  const totalSalesValue = sales.reduce((sum: number, sale: any) => sum + parseFloat(sale.salePrice || 0), 0);
  const grossProfit = totalSalesValue - totalPurchaseValue;
  const profitMargin = totalSalesValue > 0 ? (grossProfit / totalSalesValue) * 100 : 0;

  // Veículos com informações de margem
  const vehiclesWithMargin = vehicles.map((vehicle: any) => {
    const purchase = purchases.find((p: any) => p.vehicleId === vehicle.id);
    const sale = sales.find((s: any) => s.vehicleId === vehicle.id);
    
    return {
      ...vehicle,
      purchasePrice: purchase?.purchasePrice || 0,
      potentialProfit: purchase ? vehicle.price - purchase.purchasePrice : 0,
      profitMargin: purchase && vehicle.price > 0 ? ((vehicle.price - purchase.purchasePrice) / vehicle.price) * 100 : 0,
      actualProfit: sale && purchase ? parseFloat(sale.salePrice) - purchase.purchasePrice : null
    };
  });

  const handleNewPurchase = () => {
    if (!canCreatePurchases) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para registrar compras.",
        variant: "destructive",
      });
      return;
    }
    setShowPurchaseForm(true);
  };

  const handleNewSale = () => {
    if (!canCreateSales) {
      toast({
        title: "Acesso Negado",
        description: "Você não tem permissão para registrar vendas.",
        variant: "destructive",
      });
      return;
    }
    setShowSaleForm(true);
  };

  const handleSaleSubmit = (saleData: any) => {
    console.log("Dados da venda:", saleData);
    
    // Salvar venda no localStorage
    const newSale = {
      id: Date.now().toString(),
      ...saleData,
      saleDate: new Date().toISOString(),
      soldBy: user?.name || 'Admin'
    };
    
    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    localStorage.setItem('sales', JSON.stringify(updatedSales));
    
    // Atualizar status do veículo para vendido
    const updatedVehicles = vehicles.map((vehicle: any) => 
      vehicle.id === saleData.vehicleId 
        ? { ...vehicle, status: 'vendido' }
        : vehicle
    );
    setVehicles(updatedVehicles);
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
    
    setShowSaleForm(false);
    refreshSales();
    refreshVehicles();
    
    toast({
      title: "Venda registrada com sucesso!",
      description: `Veículo vendido por R$ ${parseFloat(saleData.salePrice).toLocaleString()}`,
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-montserrat mb-2">Gestão Financeira</h2>
        <p className="text-gray-600 font-opensans">
          Controle de compras, vendas e análise de margem de lucro
        </p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Investido</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {totalPurchaseValue.toLocaleString()}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vendido</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalSalesValue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lucro Bruto</p>
                <p className={`text-2xl font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {grossProfit.toLocaleString()}
                </p>
              </div>
              <TrendingUp className={`h-8 w-8 ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Margem de Lucro</p>
                <p className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profitMargin.toFixed(1)}%
                </p>
              </div>
              <AlertCircle className={`h-8 w-8 ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principais */}
      <Tabs defaultValue="purchases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="purchases">Compras</TabsTrigger>
          <TabsTrigger value="sales" disabled={!canViewSales}>
            Vendas
            {!canViewSales && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="inventory" disabled={!canManageInventory}>
            Estoque
            {!canManageInventory && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
          <TabsTrigger value="analysis" disabled={!canViewAnalysis}>
            Análise
            {!canViewAnalysis && <Lock className="h-3 w-3 ml-1" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="purchases" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold font-montserrat">Compras de Veículos</h3>
            <Button 
              onClick={handleNewPurchase}
              className="bg-accent text-black hover:bg-accent/90"
              disabled={!canCreatePurchases}
            >
              {!canCreatePurchases && <Lock className="h-4 w-4 mr-2" />}
              Nova Compra
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              {purchases.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhuma compra registrada ainda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase: any) => {
                    const vehicle = vehicles.find((v: any) => v.id === purchase.vehicleId);
                    return (
                      <div key={purchase.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">
                              {vehicle?.brand} {vehicle?.model} - {vehicle?.year}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Fornecedor: {purchase.supplier}
                            </p>
                            <p className="text-sm text-gray-600">
                              Data: {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-red-600">
                              R$ {purchase.purchasePrice.toLocaleString()}
                            </p>
                            <p className="text-sm capitalize text-gray-600">
                              Condição: {purchase.condition}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dialog de Nova Compra */}
          <Dialog open={showPurchaseForm} onOpenChange={setShowPurchaseForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Compra de Veículo</DialogTitle>
              </DialogHeader>
              <VehiclePurchaseForm 
                onSubmit={() => {
                  setShowPurchaseForm(false);
                  refreshVehicles();
                }}
                onCancel={() => setShowPurchaseForm(false)}
              />
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          {canViewSales ? (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold font-montserrat">Vendas de Veículos</h3>
                <Button 
                  onClick={handleNewSale}
                  className="bg-green-600 text-white hover:bg-green-700"
                  disabled={!canCreateSales}
                >
                  {!canCreateSales && <Lock className="h-4 w-4 mr-2" />}
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Venda
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  {sales.length === 0 ? (
                    <div className="text-center py-8">
                      <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma venda registrada ainda.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Veículo</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Valor da Venda</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Vendedor</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sales.map((sale: any) => {
                          const vehicle = vehicles.find((v: any) => v.id === sale.vehicleId);
                          return (
                            <TableRow key={sale.id}>
                              <TableCell>
                                <div>
                                  <p className="font-semibold">
                                    {vehicle?.brand} {vehicle?.model}
                                  </p>
                                  <p className="text-sm text-gray-600">{vehicle?.year}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{sale.customerName}</p>
                                  <p className="text-sm text-gray-600">{sale.customerEmail}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="font-bold text-green-600">
                                  R$ {parseFloat(sale.salePrice).toLocaleString()}
                                </p>
                              </TableCell>
                              <TableCell>
                                {new Date(sale.saleDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{sale.soldBy}</TableCell>
                              <TableCell>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                                  Concluída
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Dialog de Nova Venda */}
              <Dialog open={showSaleForm} onOpenChange={setShowSaleForm}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Registrar Nova Venda</DialogTitle>
                  </DialogHeader>
                  <SalesForm 
                    onSubmit={handleSaleSubmit}
                    onCancel={() => setShowSaleForm(false)}
                  />
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Acesso restrito ao módulo de vendas</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="inventory">
          {canManageInventory ? (
            <VehicleStatusManager 
              vehicles={vehiclesWithMargin} 
              onStatusUpdate={refreshVehicles}
            />
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Acesso restrito ao gerenciamento de estoque</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {canViewAnalysis ? (
            <Card>
              <CardHeader>
                <CardTitle>Análise de Margem por Veículo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vehiclesWithMargin
                    .filter((v: any) => v.purchasePrice > 0)
                    .map((vehicle: any) => (
                    <div key={vehicle.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">
                            {vehicle.brand} {vehicle.model} - {vehicle.year}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Custo: R$ {vehicle.purchasePrice.toLocaleString()} | 
                            Venda: R$ {vehicle.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${vehicle.potentialProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            R$ {vehicle.potentialProfit.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Margem: {vehicle.profitMargin.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Acesso restrito às análises financeiras</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financial;
