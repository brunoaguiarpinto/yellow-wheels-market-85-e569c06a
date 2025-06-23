
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
  onCustomerSubmit: (data: any) => void;
  onCustomerEdit: (customer: Customer) => void;
  onCustomerDelete: (customerId: string) => void;
}

const CustomerManagement = ({ 
  customers, 
  onCustomerSubmit, 
  onCustomerEdit, 
  onCustomerDelete 
}: CustomerManagementProps) => {
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [customerEditDialogOpen, setCustomerEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleCustomerEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setCustomerEditDialogOpen(true);
    onCustomerEdit(customer);
  };

  const handleCustomerSubmit = (data: any) => {
    onCustomerSubmit(data);
    setCustomerDialogOpen(false);
    setCustomerEditDialogOpen(false);
    setEditingCustomer(null);
  };

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

      <Dialog open={customerEditDialogOpen} onOpenChange={setCustomerEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Editar Cliente</DialogTitle>
          </DialogHeader>
          <CustomerForm 
            onSubmit={handleCustomerSubmit}
            onCancel={() => {
              setCustomerEditDialogOpen(false);
              setEditingCustomer(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;
