
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, Car, Users, DollarSign, TrendingUp, Target, Calendar, Plus, Ban } from "lucide-react";
import VehicleForm from "@/components/VehicleForm";
import CustomerForm from "@/components/CustomerForm";
import SalesForm from "@/components/SalesForm";

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const permissions = usePermissions();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showSalesForm, setShowSalesForm] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setVehicles(JSON.parse(localStorage.getItem('vehicles') || '[]'));
    setCustomers(JSON.parse(localStorage.getItem('customers') || '[]'));
    const allSales = JSON.parse(localStorage.getItem('sales') || '[]');
    // Filtrar vendas apenas do funcionário atual
    setSales(allSales.filter((sale: any) => sale.employeeId === user?.id));
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const handleVehicleSubmit = (data: any) => {
    const vehicle = {
      id: Date.now().toString(),
      ...data,
      createdBy: user?.id,
      createdAt: new Date().toISOString()
    };
    const existingVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    existingVehicles.push(vehicle);
    localStorage.setItem('vehicles', JSON.stringify(existingVehicles));
    setShowVehicleForm(false);
    loadData();
  };

  const handleCustomerSubmit = (data: any) => {
    const customer = {
      id: Date.now().toString(),
      ...data,
      createdBy: user?.id,
      createdAt: new Date().toISOString()
    };
    const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]');
    existingCustomers.push(customer);
    localStorage.setItem('customers', JSON.stringify(existingCustomers));
    setShowCustomerForm(false);
    loadData();
  };

  const handleSalesSubmit = () => {
    setShowSalesForm(false);
    loadData();
  };

  // Calcular métricas reais
  const calculateMetrics = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthSales = sales.filter((sale: any) => {
      const saleDate = new Date(sale.saleDate);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });

    const totalSales = monthSales.reduce((sum: number, sale: any) => sum + parseFloat(sale.salePrice), 0);
    const totalCommission = monthSales.reduce((sum: number, sale: any) => {
      return sum + (parseFloat(sale.salePrice) * parseFloat(sale.commission) / 100);
    }, 0);

    return {
      monthSales: monthSales.length,
      totalSales,
      totalCommission,
      activeCustomers: customers.length
    };
  };

  const metrics = calculateMetrics();

  if (!user || user.role !== 'employee') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="font-opensans">Acesso não autorizado.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-montserrat font-bold">
                Dashboard - Lord Veículos
              </h1>
              <p className="font-opensans text-gray-600">
                Bem-vindo, {user.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="font-opensans text-gray-600">{user.name}</span>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="font-opensans"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="font-opensans">Visão Geral</TabsTrigger>
            <TabsTrigger 
              value="vehicles" 
              className="font-opensans"
              disabled={!permissions.canCreateVehicles && !permissions.canEditVehicles}
            >
              Veículos
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="font-opensans"
              disabled={!permissions.canCreateClients && !permissions.canEditClients}
            >
              Clientes
            </TabsTrigger>
            <TabsTrigger 
              value="sales" 
              className="font-opensans"
              disabled={!permissions.canViewSales}
            >
              Minhas Vendas
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-slide-up">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-opensans">Vendas Este Mês</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-montserrat font-bold text-green-600">
                    R$ {metrics.totalSales.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-xs text-muted-foreground font-opensans">
                    {metrics.monthSales} vendas realizadas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-opensans">Veículos Vendidos</CardTitle>
                  <Car className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-montserrat font-bold text-blue-600">
                    {metrics.monthSales}
                  </div>
                  <p className="text-xs text-muted-foreground font-opensans">Meta: 6 veículos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-opensans">Clientes Cadastrados</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-montserrat font-bold text-purple-600">
                    {metrics.activeCustomers}
                  </div>
                  <p className="text-xs text-muted-foreground font-opensans">Total de clientes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-opensans">Comissão Mensal</CardTitle>
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-montserrat font-bold text-yellow-600">
                    R$ {metrics.totalCommission.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-xs text-muted-foreground font-opensans">Comissões acumuladas</p>
                </CardContent>
              </Card>
            </div>

            {/* Metas e Agenda */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Meta Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-opensans text-sm">Vendas</span>
                        <span className="font-opensans text-sm">{metrics.monthSales}/6 veículos</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: `${Math.min((metrics.monthSales / 6) * 100, 100)}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-opensans text-sm">Faturamento</span>
                        <span className="font-opensans text-sm">R$ {(metrics.totalSales/1000).toFixed(0)}k/R$ 300k</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: `${Math.min((metrics.totalSales / 300000) * 100, 100)}%`}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Próximos Agendamentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                      <div className="flex-1">
                        <p className="font-opensans font-semibold text-sm">Test Drive - Honda Civic</p>
                        <p className="font-opensans text-xs text-gray-600">Maria Santos - 14:00</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                      <div className="flex-1">
                        <p className="font-opensans font-semibold text-sm">Reunião - Financiamento</p>
                        <p className="font-opensans text-xs text-gray-600">João Silva - 16:30</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-yellow-50 rounded">
                      <div className="flex-1">
                        <p className="font-opensans font-semibold text-sm">Follow-up Cliente</p>
                        <p className="font-opensans text-xs text-gray-600">Ana Costa - Amanhã 10:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6 animate-slide-up">
            {!permissions.canCreateVehicles && !permissions.canEditVehicles ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Ban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="font-opensans text-gray-600">
                    Você não tem permissão para acessar esta seção.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-montserrat font-bold">Gestão de Veículos</h2>
                  {permissions.canCreateVehicles && (
                    <Button 
                      onClick={() => setShowVehicleForm(true)}
                      className="bg-accent text-black hover:bg-accent/90 font-opensans"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Veículo
                    </Button>
                  )}
                </div>

                {showVehicleForm ? (
                  <VehicleForm 
                    onSubmit={handleVehicleSubmit}
                    onCancel={() => setShowVehicleForm(false)}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-montserrat">Veículos Cadastrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {vehicles.length === 0 ? (
                        <p className="font-opensans text-gray-600 text-center py-8">
                          Nenhum veículo cadastrado ainda.
                        </p>
                      ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {vehicles.map((vehicle: any) => (
                            <Card key={vehicle.id} className="p-4">
                              <h3 className="font-montserrat font-semibold">
                                {vehicle.brand} {vehicle.model}
                              </h3>
                              <p className="font-opensans text-sm text-gray-600">
                                {vehicle.year} - R$ {parseFloat(vehicle.price).toLocaleString('pt-BR')}
                              </p>
                              <p className="font-opensans text-xs text-gray-500">
                                {vehicle.mileage} km - {vehicle.fuel}
                              </p>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6 animate-slide-up">
            {!permissions.canCreateClients && !permissions.canEditClients ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Ban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="font-opensans text-gray-600">
                    Você não tem permissão para acessar esta seção.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-montserrat font-bold">Gestão de Clientes</h2>
                  {permissions.canCreateClients && (
                    <Button 
                      onClick={() => setShowCustomerForm(true)}
                      className="bg-accent text-black hover:bg-accent/90 font-opensans"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Cadastrar Cliente
                    </Button>
                  )}
                </div>

                {showCustomerForm ? (
                  <CustomerForm 
                    onSubmit={handleCustomerSubmit}
                    onCancel={() => setShowCustomerForm(false)}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-montserrat">Clientes Cadastrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {customers.length === 0 ? (
                        <p className="font-opensans text-gray-600 text-center py-8">
                          Nenhum cliente cadastrado ainda.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {customers.map((customer: any) => (
                            <Card key={customer.id} className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-montserrat font-semibold">{customer.name}</h3>
                                  <p className="font-opensans text-sm text-gray-600">{customer.email}</p>
                                  <p className="font-opensans text-sm text-gray-600">{customer.phone}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-opensans text-xs text-gray-500">
                                    Interesse: {customer.vehicleInterest || 'Não informado'}
                                  </p>
                                  <p className="font-opensans text-xs text-gray-500">
                                    Faixa: {customer.priceRange || 'Não informado'}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6 animate-slide-up">
            {!permissions.canViewSales ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Ban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="font-opensans text-gray-600">
                    Você não tem permissão para acessar esta seção.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-montserrat font-bold">Minhas Vendas</h2>
                  {permissions.canCreateSales && (
                    <Button 
                      onClick={() => setShowSalesForm(true)}
                      className="bg-accent text-black hover:bg-accent/90 font-opensans"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Venda
                    </Button>
                  )}
                </div>

                {showSalesForm ? (
                  <SalesForm 
                    onSubmit={handleSalesSubmit}
                    onCancel={() => setShowSalesForm(false)}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-montserrat">Histórico de Vendas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {sales.length === 0 ? (
                        <p className="font-opensans text-gray-600 text-center py-8">
                          Nenhuma venda registrada ainda.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {sales.map((sale: any) => {
                            const vehicle = vehicles.find((v: any) => v.id === sale.vehicleId);
                            const customer = customers.find((c: any) => c.id === sale.clientId);
                            const commissionValue = (parseFloat(sale.salePrice) * parseFloat(sale.commission) / 100);
                            
                            return (
                              <Card key={sale.id} className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-montserrat font-semibold">
                                      {vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Veículo não encontrado'}
                                    </h3>
                                    <p className="font-opensans text-sm text-gray-600">
                                      Cliente: {customer ? customer.name : 'Cliente não encontrado'}
                                    </p>
                                    <p className="font-opensans text-sm text-gray-600">
                                      Data: {new Date(sale.saleDate).toLocaleDateString('pt-BR')}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-montserrat font-semibold text-green-600">
                                      R$ {parseFloat(sale.salePrice).toLocaleString('pt-BR')}
                                    </p>
                                    <p className="font-opensans text-sm text-gray-600">
                                      Comissão: {sale.commission}% (R$ {commissionValue.toLocaleString('pt-BR')})
                                    </p>
                                  </div>
                                </div>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
