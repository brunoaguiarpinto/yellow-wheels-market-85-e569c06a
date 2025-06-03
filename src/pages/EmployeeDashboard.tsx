
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User, LogOut, Car, Users, DollarSign, TrendingUp, Target, Calendar } from "lucide-react";

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    logout();
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

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
            <TabsTrigger value="vehicles" className="font-opensans">Veículos</TabsTrigger>
            <TabsTrigger value="customers" className="font-opensans">Clientes</TabsTrigger>
            <TabsTrigger value="sales" className="font-opensans">Minhas Vendas</TabsTrigger>
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
                  <div className="text-2xl font-montserrat font-bold text-green-600">R$ 180.000</div>
                  <p className="text-xs text-muted-foreground font-opensans">+20% vs mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-opensans">Veículos Vendidos</CardTitle>
                  <Car className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-montserrat font-bold text-blue-600">4</div>
                  <p className="text-xs text-muted-foreground font-opensans">Meta: 6 veículos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-opensans">Clientes Ativos</CardTitle>
                  <Users className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-montserrat font-bold text-purple-600">12</div>
                  <p className="text-xs text-muted-foreground font-opensans">Prospects ativos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-opensans">Comissão Mensal</CardTitle>
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-montserrat font-bold text-yellow-600">R$ 9.000</div>
                  <p className="text-xs text-muted-foreground font-opensans">5% das vendas</p>
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
                        <span className="font-opensans text-sm">4/6 veículos</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '66%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-opensans text-sm">Faturamento</span>
                        <span className="font-opensans text-sm">R$ 180k/R$ 300k</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
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

          {/* Placeholder para outras tabs */}
          <TabsContent value="vehicles" className="space-y-6 animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Gestão de Veículos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-opensans text-gray-600">
                  Seção de veículos em desenvolvimento. Aqui você poderá cadastrar e gerenciar o estoque de veículos.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6 animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Gestão de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-opensans text-gray-600">
                  Seção de clientes em desenvolvimento. Aqui você poderá gerenciar seus clientes e prospects.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6 animate-slide-up">
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat">Minhas Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-opensans text-gray-600">
                  Seção de vendas em desenvolvimento. Aqui você poderá acompanhar suas vendas e comissões.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
