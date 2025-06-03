import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, User } from "lucide-react";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("vehicles");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Senha padrão admin/admin
    if (username === "admin" && password === "admin") {
      setIsLoggedIn(true);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao painel administrativo da Lord Veículos.",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos.",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-montserrat font-bold">
              Painel Administrativo
            </CardTitle>
            <p className="font-opensans text-gray-600">
              Lord Veículos - Faça login para acessar o sistema
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username" className="font-opensans">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite: admin"
                  className="font-opensans"
                />
              </div>
              <div>
                <Label htmlFor="password" className="font-opensans">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite: admin"
                  className="font-opensans"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-accent text-black hover:bg-accent/90 font-opensans font-semibold"
              >
                Entrar
              </Button>
              <Button 
                type="button" 
                variant="link" 
                className="w-full text-accent font-opensans"
              >
                Esqueci a Senha
              </Button>
            </form>
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
            <h1 className="text-2xl font-montserrat font-bold">
              Painel Administrativo - Lord Veículos
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="font-opensans text-gray-600">Admin</span>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsLoggedIn(false)}
                className="font-opensans"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="vehicles" className="font-opensans">Veículos</TabsTrigger>
            <TabsTrigger value="financial" className="font-opensans">Financeiro</TabsTrigger>
            <TabsTrigger value="employees" className="font-opensans">Funcionários</TabsTrigger>
            <TabsTrigger value="customers" className="font-opensans">Clientes</TabsTrigger>
          </TabsList>

          {/* Vehicles Tab */}
          <TabsContent value="vehicles" className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-montserrat font-bold">Gerenciamento de Veículos</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Veículo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-montserrat">Adicionar Novo Veículo</DialogTitle>
                  </DialogHeader>
                  <VehicleForm />
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-opensans">Marca</TableHead>
                      <TableHead className="font-opensans">Modelo</TableHead>
                      <TableHead className="font-opensans">Ano</TableHead>
                      <TableHead className="font-opensans">Preço</TableHead>
                      <TableHead className="font-opensans">Status</TableHead>
                      <TableHead className="font-opensans">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-opensans">Toyota</TableCell>
                      <TableCell className="font-opensans">Corolla</TableCell>
                      <TableCell className="font-opensans">2022</TableCell>
                      <TableCell className="font-opensans">R$ 89.000</TableCell>
                      <TableCell>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-opensans">
                          Disponível
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6 animate-slide-up">
            <h2 className="text-3xl font-montserrat font-bold">Controle Financeiro</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-opensans text-green-600">Vendas do Mês</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-montserrat font-bold text-green-600">R$ 450.000</p>
                  <p className="font-opensans text-gray-600">+15% vs mês anterior</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-opensans text-blue-600">Comissões</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-montserrat font-bold text-blue-600">R$ 22.500</p>
                  <p className="font-opensans text-gray-600">5% das vendas</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="font-opensans text-purple-600">Estoque</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-montserrat font-bold text-purple-600">45 veículos</p>
                  <p className="font-opensans text-gray-600">R$ 2.1M em estoque</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Employees Tab */}
          <TabsContent value="employees" className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-montserrat font-bold">Gerenciamento de Funcionários</h2>
              <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Funcionário
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-opensans">Nome</TableHead>
                      <TableHead className="font-opensans">Cargo</TableHead>
                      <TableHead className="font-opensans">Email</TableHead>
                      <TableHead className="font-opensans">Vendas</TableHead>
                      <TableHead className="font-opensans">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-opensans">João Silva</TableCell>
                      <TableCell className="font-opensans">Vendedor</TableCell>
                      <TableCell className="font-opensans">joao@lordveiculos.com</TableCell>
                      <TableCell className="font-opensans">12 veículos</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-montserrat font-bold">Gerenciamento de Clientes</h2>
              <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-opensans">Nome</TableHead>
                      <TableHead className="font-opensans">Email</TableHead>
                      <TableHead className="font-opensans">Telefone</TableHead>
                      <TableHead className="font-opensans">Interesse</TableHead>
                      <TableHead className="font-opensans">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-opensans">Maria Santos</TableCell>
                      <TableCell className="font-opensans">maria@email.com</TableCell>
                      <TableCell className="font-opensans">(11) 99999-9999</TableCell>
                      <TableCell className="font-opensans">SUV até R$ 100k</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Vehicle Form Component
const VehicleForm = () => {
  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand" className="font-opensans">Marca</Label>
          <Input id="brand" placeholder="Ex: Toyota" className="font-opensans" />
        </div>
        <div>
          <Label htmlFor="model" className="font-opensans">Modelo</Label>
          <Input id="model" placeholder="Ex: Corolla" className="font-opensans" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year" className="font-opensans">Ano</Label>
          <Input id="year" type="number" placeholder="2023" className="font-opensans" />
        </div>
        <div>
          <Label htmlFor="price" className="font-opensans">Preço</Label>
          <Input id="price" type="number" placeholder="89000" className="font-opensans" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mileage" className="font-opensans">Quilometragem</Label>
          <Input id="mileage" type="number" placeholder="15000" className="font-opensans" />
        </div>
        <div>
          <Label htmlFor="fuel" className="font-opensans">Combustível</Label>
          <Select>
            <SelectTrigger className="font-opensans">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flex">Flex</SelectItem>
              <SelectItem value="gasoline">Gasolina</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="electric">Elétrico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-accent text-black hover:bg-accent/90 font-opensans font-semibold">
        Salvar Veículo
      </Button>
    </form>
  );
};

export default Admin;
