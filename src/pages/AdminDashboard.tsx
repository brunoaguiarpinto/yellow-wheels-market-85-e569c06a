
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
import CRM from "./CRM";
import { useAuth } from "@/contexts/AuthContext";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
}

const Admin = () => {
  const { isAuthenticated, isAdmin, user, logout, login, isLoading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("vehicles");
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [vehicleEditDialogOpen, setVehicleEditDialogOpen] = useState(false);
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [customerEditDialogOpen, setCustomerEditDialogOpen] = useState(false);
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [employeeEditDialogOpen, setEmployeeEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  useEffect(() => {
    // Carregar dados do localStorage
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }

    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    } else {
      // Dados iniciais de veículos
      const initialVehicles = [
        { id: "1", brand: "Toyota", model: "Corolla", year: 2022, price: 89000, status: "Disponível" }
      ];
      setVehicles(initialVehicles);
      localStorage.setItem('vehicles', JSON.stringify(initialVehicles));
    }

    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      // Dados iniciais de clientes
      const initialCustomers = [
        { id: "1", name: "Maria Santos", email: "maria@email.com", phone: "(11) 99999-9999", interest: "SUV até R$ 100k" }
      ];
      setCustomers(initialCustomers);
      localStorage.setItem('customers', JSON.stringify(initialCustomers));
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
    if (editingVehicle) {
      // Atualizar veículo existente
      const updatedVehicles = vehicles.map(vehicle => 
        vehicle.id === editingVehicle.id 
          ? { ...vehicle, ...data, id: editingVehicle.id }
          : vehicle
      );
      setVehicles(updatedVehicles);
      localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
      toast({
        title: "Veículo atualizado",
        description: "Os dados do veículo foram atualizados com sucesso.",
      });
    } else {
      // Adicionar novo veículo
      const newVehicle = {
        id: Date.now().toString(),
        ...data,
        status: "Disponível"
      };
      const updatedVehicles = [...vehicles, newVehicle];
      setVehicles(updatedVehicles);
      localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
      toast({
        title: "Veículo adicionado",
        description: "Novo veículo foi adicionado com sucesso.",
      });
    }
    setVehicleDialogOpen(false);
    setVehicleEditDialogOpen(false);
    setEditingVehicle(null);
  };

  const handleCustomerSubmit = (data: any) => {
    if (editingCustomer) {
      // Atualizar cliente existente
      const updatedCustomers = customers.map(customer => 
        customer.id === editingCustomer.id 
          ? { ...customer, ...data, id: editingCustomer.id }
          : customer
      );
      setCustomers(updatedCustomers);
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso.",
      });
    } else {
      // Adicionar novo cliente
      const newCustomer = {
        id: Date.now().toString(),
        ...data
      };
      const updatedCustomers = [...customers, newCustomer];
      setCustomers(updatedCustomers);
      localStorage.setItem('customers', JSON.stringify(updatedCustomers));
      toast({
        title: "Cliente adicionado",
        description: "Novo cliente foi adicionado com sucesso.",
      });
    }
    setCustomerDialogOpen(false);
    setCustomerEditDialogOpen(false);
    setEditingCustomer(null);
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

  const handleVehicleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleEditDialogOpen(true);
  };

  const handleCustomerEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerEditDialogOpen(true);
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

  const deleteVehicle = (vehicleId: string) => {
    const updatedVehicles = vehicles.filter(vehicle => vehicle.id !== vehicleId);
    setVehicles(updatedVehicles);
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
    toast({
      title: "Veículo removido",
      description: "O veículo foi removido do sistema.",
    });
  };

  const deleteCustomer = (customerId: string) => {
    const updatedCustomers = customers.filter(customer => customer.id !== customerId);
    setCustomers(updatedCustomers);
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    toast({
      title: "Cliente removido",
      description: "O cliente foi removido do sistema.",
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
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-opensans">{vehicle.brand}</TableCell>
                        <TableCell className="font-opensans">{vehicle.model}</TableCell>
                        <TableCell className="font-opensans">{vehicle.year}</TableCell>
                        <TableCell className="font-opensans">R$ {vehicle.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-opensans">
                            {vehicle.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleVehicleEdit(vehicle)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteVehicle(vehicle.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {vehicles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <p className="font-opensans text-gray-500">
                            Nenhum veículo cadastrado ainda.
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Dialog de Edição de Veículo */}
            <Dialog open={vehicleEditDialogOpen} onOpenChange={setVehicleEditDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-montserrat">Editar Veículo</DialogTitle>
                </DialogHeader>
                {editingVehicle && (
                  <VehicleForm 
                    initialData={editingVehicle}
                    onSubmit={handleVehicleSubmit}
                    onCancel={() => {
                      setVehicleEditDialogOpen(false);
                      setEditingVehicle(null);
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
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
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-opensans">{customer.name}</TableCell>
                        <TableCell className="font-opensans">{customer.email}</TableCell>
                        <TableCell className="font-opensans">{customer.phone}</TableCell>
                        <TableCell className="font-opensans">{customer.interest}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleCustomerEdit(customer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => deleteCustomer(customer.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {customers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="font-opensans text-gray-500">
                            Nenhum cliente cadastrado ainda.
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Dialog de Edição de Cliente */}
            <Dialog open={customerEditDialogOpen} onOpenChange={setCustomerEditDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-montserrat">Editar Cliente</DialogTitle>
                </DialogHeader>
                {editingCustomer && (
                  <CustomerForm 
                    initialData={editingCustomer}
                    onSubmit={handleCustomerSubmit}
                    onCancel={() => {
                      setCustomerEditDialogOpen(false);
                      setEditingCustomer(null);
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        );

      case "crm":
        return <CRM />;

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
