
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash } from "lucide-react";
import CustomerForm from "@/components/CustomerForm";
import { Customer } from "@/types/crm";

interface CustomerManagementProps {
  customers: Customer[];
  editingCustomer: Customer | null;
  setEditingCustomer: (customer: Customer | null) => void;
  onCustomerSubmit: (data: any) => void;
  onCustomerEdit: (customer: Customer) => void;
  onCustomerDelete: (customerId: string) => void;
}

const CustomerManagement = ({ 
  customers, 
  editingCustomer,
  setEditingCustomer,
  onCustomerSubmit, 
  onCustomerEdit, 
  onCustomerDelete 
}: CustomerManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleCustomerEdit = (customer: Customer) => {
    onCustomerEdit(customer);
  };

  const handleCustomerSubmit = (data: any) => {
    onCustomerSubmit(data);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-montserrat font-bold">Gerenciamento de Clientes</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold" onClick={() => setEditingCustomer(null)}>
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
              onCancel={() => setIsAddDialogOpen(false)}
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
                <TableHead className="font-opensans">Interesse em Veículo</TableHead>
                <TableHead className="font-opensans">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-opensans">{customer.name}</TableCell>
                  <TableCell className="font-opensans">{customer.email}</TableCell>
                  <TableCell className="font-opensans">{customer.phone}</TableCell>
                  <TableCell className="font-opensans">{customer.vehicleInterest || 'N/A'}</TableCell>
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
                        onClick={() => onCustomerDelete(customer.id)}
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

      <Dialog open={!!editingCustomer} onOpenChange={(isOpen) => !isOpen && setEditingCustomer(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Editar Cliente</DialogTitle>
          </DialogHeader>
          <CustomerForm 
            initialData={editingCustomer}
            onSubmit={handleCustomerSubmit}
            onCancel={() => setEditingCustomer(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
