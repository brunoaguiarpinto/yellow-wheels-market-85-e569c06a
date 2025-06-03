import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash, User, Eye, EyeOff } from "lucide-react";
import VehicleForm from "@/components/VehicleForm";
import CustomerForm from "@/components/CustomerForm";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeEditForm from "@/components/EmployeeEditForm";
import AdminSidebar from "@/components/AdminSidebar";
import Financial from "./Financial";
import { useAuth } from "@/hooks/use-auth";

const Admin = () => {
  const { isAuthenticated, isAdmin, user, logout, login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("vehicles");
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [employeeEditDialogOpen, setEmployeeEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    // Carregar funcionários do localStorage
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(username, password, 'admin');
    
    if (success) {
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

  const handleVehicleSubmit = (data: any) => {
    console.log("Dados do veículo:", data);
    setVehicleDialogOpen(false);
  };

  const handleCustomerSubmit = (data: any) => {
    console.log("Dados do cliente:", data);
    setCustomerDialogOpen(false);
  };

  const handleEmployeeSubmit = (data: any) => {
    console.log("Dados do funcionário:", data);
    
    // Salvar funcionário no localStorage
    const updatedEmployees = [...employees, data];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    setEmployeeDialogOpen(false);
    toast({
      title: "Funcionário cadastrado com sucesso!",
      description: `Login: ${data.email} | Senha: ${data.password}`,
    });
  };

  const handleEmployeeEdit = (employee: any) => {
    setEditingEmployee(employee);
    setEmployeeEditDialogOpen(true);
  };

  const handleEmployeeUpdate = (data: any) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === data.id ? data : emp
    );
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    setEmployeeEditDialogOpen(false);
    setEditingEmployee(null);
    
    toast({
      title: "Funcionário atualizado!",
      description: "Os dados do funcionário foram atualizados com sucesso.",
    });
  };

  const togglePasswordVisibility = (employeeId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  const deleteEmployee = (employeeId: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    toast({
      title: "Funcionário removido",
      description: "O funcionário foi removido do sistema.",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "vehicles":
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-montserrat font-bold">Gerenciamento de Veículos</h2>
              <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Veículo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-montserrat">Adicionar Novo Veículo</DialogTitle>
                  </DialogHeader>
                  <VehicleForm 
                    onSubmit={handleVehicleSubmit}
                    onCancel={() => setVehicleDialogOpen(false)}
                  />
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
          </div>
        );

      case "employees":
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-montserrat font-bold">Gerenciamento de Funcionários</h2>
              <div className="flex space-x-4">
                <Dialog open={employeeDialogOpen} onOpenChange={setEmployeeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Funcionário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-montserrat">Cadastrar Novo Funcionário</DialogTitle>
                    </DialogHeader>
                    <EmployeeForm 
                      onSubmit={handleEmployeeSubmit}
                      onCancel={() => setEmployeeDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-opensans">Nome</TableHead>
                      <TableHead className="font-opensans">Email</TableHead>
                      <TableHead className="font-opensans">Cargo</TableHead>
                      <TableHead className="font-opensans">Departamento</TableHead>
                      <TableHead className="font-opensans">Permissões</TableHead>
                      <TableHead className="font-opensans">Senha</TableHead>
                      <TableHead className="font-opensans">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-opensans">{employee.name}</TableCell>
                        <TableCell className="font-opensans">{employee.email}</TableCell>
                        <TableCell className="font-opensans">{employee.position}</TableCell>
                        <TableCell className="font-opensans">{employee.department}</TableCell>
                        <TableCell className="font-opensans">
                          <div className="flex flex-wrap gap-1">
                            {employee.permissions?.length > 0 ? (
                              employee.permissions.map((permission: string) => (
                                <span 
                                  key={permission} 
                                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                >
                                  {permission.split('.')[1]}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-500 text-sm">Nenhuma</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-opensans">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm">
                              {showPasswords[employee.id] ? employee.password : '••••••'}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => togglePasswordVisibility(employee.id)}
                            >
                              {showPasswords[employee.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEmployeeEdit(employee)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteEmployee(employee.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {employees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="font-opensans text-gray-500">
                            Nenhum funcionário cadastrado ainda.
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Dialog de Edição de Funcionário */}
            <Dialog open={employeeEditDialogOpen} onOpenChange={setEmployeeEditDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-montserrat">Editar Funcionário</DialogTitle>
                </DialogHeader>
                {editingEmployee && (
                  <EmployeeEditForm 
                    employee={editingEmployee}
                    onSubmit={handleEmployeeUpdate}
                    onCancel={() => {
                      setEmployeeEditDialogOpen(false);
                      setEditingEmployee(null);
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        );

      case "customers":
        return (
          <div className="space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-montserrat font-bold">Gerenciamento de Clientes</h2>
              <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Cliente
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-montserrat">Adicionar Novo Cliente</DialogTitle>
                  </DialogHeader>
                  <CustomerForm 
                    onSubmit={handleCustomerSubmit}
                    onCancel={() => setCustomerDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
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
          </div>
        );

      case "financial":
        return <Financial />;

      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="font-opensans text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado ou não for admin, mostrar tela de login
  if (!isAuthenticated || !isAdmin) {
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
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
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
    <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="font-opensans text-gray-600">
                {user?.name || 'Admin'}
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={logout}
              className="font-opensans"
            >
              Sair
            </Button>
          </div>
        </div>

        {renderContent()}
      </div>
    </AdminSidebar>
  );
};

export default Admin;
