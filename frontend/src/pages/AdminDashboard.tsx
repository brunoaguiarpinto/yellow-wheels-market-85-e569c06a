import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
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
import { Customer } from "@/types/crm";
import { User as Employee } from "@/contexts/AuthContext";

// Tipos locais para veículos (serão refatorados depois)
interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
}

const Admin = () => {
  const { isAuthenticated, isAdmin, user, logout, login, isLoading: authIsLoading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("employees");
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Lógica de dados para Clientes com React Query
  const { data: customers = [], isLoading: customersIsLoading } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await api.get('/customers');
      return data;
    },
    enabled: isAuthenticated && isAdmin,
  });

  // Lógica de dados para Funcionários com React Query
  const { data: employees = [], isLoading: employeesIsLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await api.get('/employees');
      return data;
    },
    enabled: isAuthenticated && isAdmin,
  });

  const createCustomerMutation = useMutation({
    mutationFn: (newCustomerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => api.post('/customers', newCustomerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: "Cliente adicionado", description: "Novo cliente foi adicionado com sucesso." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível adicionar o cliente.", variant: "destructive" });
    }
  });

  const updateCustomerMutation = useMutation({
    mutationFn: (updatedCustomer: Customer) => api.put(`/customers/${updatedCustomer.id}`, updatedCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: "Cliente atualizado", description: "Os dados do cliente foram atualizados com sucesso." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível atualizar o cliente.", variant: "destructive" });
    }
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (customerId: string) => api.delete(`/customers/${customerId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: "Cliente removido", description: "O cliente foi removido do sistema." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível remover o cliente.", variant: "destructive" });
    }
  });

  const createEmployeeMutation = useMutation({
    mutationFn: (newEmployeeData: any) => api.post('/employees', newEmployeeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({ title: "Funcionário adicionado", description: "Novo funcionário foi adicionado com sucesso." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível adicionar o funcionário.", variant: "destructive" });
    }
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: (updatedEmployee: any) => api.put(`/employees/${updatedEmployee.id}`, updatedEmployee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({ title: "Funcionário atualizado", description: "Os dados do funcionário foram atualizados com sucesso." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível atualizar o funcionário.", variant: "destructive" });
    }
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: (employeeId: string) => api.delete(`/employees/${employeeId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({ title: "Funcionário removido", description: "O funcionário foi removido do sistema." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível remover o funcionário.", variant: "destructive" });
    }
  });

  // Lógica de dados para Veículos com React Query
  const { data: vehicles = [], isLoading: vehiclesIsLoading } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data } = await api.get('/vehicles');
      return data;
    },
    enabled: isAuthenticated && isAdmin,
  });

  // TODO: Adicionar mutações para veículos

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      toast({ title: "Login realizado com sucesso!", description: "Bem-vindo ao painel administrativo." });
    } else {
      toast({ title: "Erro no login", description: "Usuário ou senha incorretos.", variant: "destructive" });
    }
  };

  const handleCustomerSubmit = (data: any) => {
    if (editingCustomer) {
      updateCustomerMutation.mutate({ ...editingCustomer, ...data });
    } else {
      createCustomerMutation.mutate(data);
    }
    setEditingCustomer(null);
  };

  const handleCustomerEdit = (customer: Customer) => {
    setEditingCustomer(customer);
  };

  const deleteCustomer = (customerId: string) => {
    deleteCustomerMutation.mutate(customerId);
  };

  const handleEmployeeSubmit = (data: any) => {
    createEmployeeMutation.mutate(data);
  };

  const handleEmployeeUpdate = (data: any) => {
    updateEmployeeMutation.mutate(data);
  };

  const deleteEmployee = (employeeId: string) => {
    deleteEmployeeMutation.mutate(employeeId);
  };

  // Funções de veículo (a serem conectadas com mutações)
  const handleVehicleSubmit = (data: any) => { console.log("Submit vehicle", data) };
  const handleVehicleEdit = (vehicle: Vehicle) => { setEditingVehicle(vehicle) };
  const deleteVehicle = (vehicleId: string) => { console.log("Delete vehicle", vehicleId) };

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
        return (
          <CustomerManagement
            customers={customers}
            editingCustomer={editingCustomer}
            setEditingCustomer={setEditingCustomer}
            onCustomerSubmit={handleCustomerSubmit}
            onCustomerEdit={handleCustomerEdit}
            onCustomerDelete={deleteCustomer}
          />
        );
      case "crm": return <CRM />;
      case "financial": return <Financial />;
      case "contracts": return <ContractsModule />;
      case "reports": return <ReportsModule />;
      default: return null;
    }
  };

  if (authIsLoading || customersIsLoading || employeesIsLoading || vehiclesIsLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="font-opensans text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <AdminLoginForm onLogin={handleLogin} isLoading={authIsLoading} />;
  }

  return (
    <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="font-opensans text-gray-600">{user?.name || 'Admin'}</span>
            </div>
            <Button variant="outline" onClick={logout} className="font-opensans">Sair</Button>
          </div>
        </div>
        {renderContent()}
      </div>
    </AdminSidebar>
  );
};

export default Admin;
