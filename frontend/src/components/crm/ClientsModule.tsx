import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Edit, Phone, Mail } from "lucide-react";
import { Customer, CustomerStatus } from "@/types/crm";
import { useToast } from "@/hooks/use-toast";
import CustomerCRMForm from "./CustomerCRMForm";

interface ClientsModuleProps {
  onCustomerSelect: (customerId: string) => void;
}

const ClientsModule = ({ onCustomerSelect }: ClientsModuleProps) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await api.get('/customers');
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: (customerData: Partial<Customer>) => {
      if (editingCustomer) {
        return api.put(`/customers/${editingCustomer.id}`, customerData);
      }
      return api.post('/customers', customerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: editingCustomer ? "Cliente atualizado" : "Cliente criado",
        description: "Os dados foram salvos com sucesso.",
      });
      setIsDialogOpen(false);
      setEditingCustomer(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar os dados do cliente.",
        variant: "destructive",
      });
    }
  });

  const handleNewCustomer = () => {
    setEditingCustomer(null);
    setIsDialogOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleSubmitCustomer = (data: any) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingCustomer(null);
  };

  const getStatusColor = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.HOT_LEAD:
        return "bg-red-100 text-red-800";
      case CustomerStatus.NEGOTIATING:
        return "bg-orange-100 text-orange-800";
      case CustomerStatus.PROSPECT:
        return "bg-blue-100 text-blue-800";
      case CustomerStatus.CLIENT:
        return "bg-green-100 text-green-800";
      case CustomerStatus.COLD_LEAD:
        return "bg-gray-100 text-gray-800";
      case CustomerStatus.LOST:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.HOT_LEAD:
        return "Lead Quente";
      case CustomerStatus.NEGOTIATING:
        return "Negociando";
      case CustomerStatus.PROSPECT:
        return "Prospect";
      case CustomerStatus.CLIENT:
        return "Cliente";
      case CustomerStatus.COLD_LEAD:
        return "Lead Frio";
      case CustomerStatus.LOST:
        return "Perdido";
      default:
        return status;
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Gestão de Clientes</h2>
          <p className="text-gray-600 text-sm sm:text-base">Gerencie seus clientes e leads</p>
        </div>
        <Button onClick={handleNewCustomer} className="flex items-center justify-center space-x-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span>Novo Cliente</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 sm:h-auto"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Cliente</TableHead>
                  <TableHead className="min-w-[200px] hidden sm:table-cell">Contato</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[150px] hidden md:table-cell">Interesse</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Responsável</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Próximo Contato</TableHead>
                  <TableHead className="min-w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">Carregando...</TableCell>
                  </TableRow>
                ) : filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} onClick={() => onCustomerSelect(customer.id)} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="p-2 sm:p-4">
                      <div>
                        <div className="font-medium text-sm sm:text-base">{customer.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{customer.city}, {customer.state}</div>
                        <div className="sm:hidden mt-1 space-y-1">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-xs">{customer.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-xs">{customer.phone}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{customer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <Badge className={`${getStatusColor(customer.status)} text-xs`}>
                        {getStatusLabel(customer.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 hidden md:table-cell">
                      <div>
                        <div className="font-medium text-sm">{customer.vehicleInterest}</div>
                        <div className="text-sm text-gray-500">{customer.priceRange}</div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 hidden lg:table-cell text-sm">{customer.assignedEmployee}</TableCell>
                    <TableCell className="p-2 sm:p-4 hidden lg:table-cell text-sm">{customer.nextFollowUp}</TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditCustomer(customer)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}
            </DialogTitle>
          </DialogHeader>
          <CustomerCRMForm
            onSubmit={handleSubmitCustomer}
            onCancel={handleCancel}
            initialData={editingCustomer || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsModule;
