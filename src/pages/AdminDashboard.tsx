import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import VehicleManagement from "@/components/admin/VehicleManagement";
import EmployeeManagement from "@/components/admin/EmployeeManagement";
import CustomerManagement from "@/components/admin/CustomerManagement";
import Financial from "./Financial";
import CRM from "./CRM";
import ContractsModule from "@/components/contracts/ContractsModule";
import ReportsModule from "@/components/reports/ReportsModule";
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
  const [activeTab, setActiveTab] = useState("vehicles");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
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
      const initialVehicles: Vehicle[] = [];
      setVehicles(initialVehicles);
      localStorage.setItem('vehicles', JSON.stringify(initialVehicles));
    }

    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    } else {
      const initialCustomers: Customer[] = [];
      setCustomers(initialCustomers);
      localStorage.setItem('customers', JSON.stringify(initialCustomers));
    }
  }, []);

  const handleLogin = async (username: string, password: string) => {
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

  const handleVehicleSubmit = (data: any) => {
    if (editingVehicle) {
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
    setEditingVehicle(null);
  };

  const handleCustomerSubmit = (data: any) => {
    if (editingCustomer) {
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
    setEditingCustomer(null);
  };

  const handleEmployeeSubmit = (data: any) => {
    console.log("Dados do funcionário:", data);
    
    const updatedEmployees = [...employees, data];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
    toast({
      title: "Funcionário cadastrado com sucesso!",
      description: `Login: ${data.email} | Senha: ${data.password}`,
    });
  };

  const handleVehicleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
  };

  const handleCustomerEdit = (customer: Customer) => {
    setEditingCustomer(customer);
  };

  const handleEmployeeUpdate = (data: any) => {
    const updatedEmployees = employees.map(emp => 
      emp.id === data.id ? data : emp
    );
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    
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
          <VehicleManagement
            vehicles={vehicles}
            onVehicleSubmit={handleVehicleSubmit}
            onVehicleEdit={handleVehicleEdit}
            onVehicleDelete={deleteVehicle}
          />
        );

      case "employees":
        return (
          <EmployeeManagement
            employees={employees}
            onEmployeeSubmit={handleEmployeeSubmit}
            onEmployeeUpdate={handleEmployeeUpdate}
            onEmployeeDelete={deleteEmployee}
          />
        );

      case "customers":
        return <CustomerManagement />;

      case "crm":
        return <CRM />;

      case "financial":
        return <Financial />;

      case "contracts":
        return <ContractsModule />;

      case "reports":
        return <ReportsModule />;

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
    return <AdminLoginForm onLogin={handleLogin} isLoading={isLoading} />;
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
