import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash, Eye, EyeOff } from "lucide-react";
import { useSupabaseData, useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";
import SupabaseEmployeeForm from "@/components/forms/SupabaseEmployeeForm";

const SupabaseEmployeeManagement = () => {
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [employeeEditDialogOpen, setEmployeeEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const { data: employees, loading, refetch } = useSupabaseData('employees');
  const { insert: insertEmployee } = useSupabaseInsert('employees');
  const { update: updateEmployee } = useSupabaseUpdate('employees');
  const { deleteRecord: deleteEmployee } = useSupabaseDelete('employees');

  const handleEmployeeSubmit = () => {
    setEmployeeDialogOpen(false);
    refetch();
  };

  const handleEmployeeEdit = (employee: any) => {
    setEditingEmployee(employee);
    setEmployeeEditDialogOpen(true);
  };

  const handleEmployeeUpdate = () => {
    setEmployeeEditDialogOpen(false);
    setEditingEmployee(null);
    refetch();
  };

  const handleEmployeeDelete = async (employeeId: string) => {
    const success = await deleteEmployee(employeeId);
    if (success) {
      refetch();
    }
  };

  const togglePasswordVisibility = (employeeId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-montserrat font-bold">Gerenciamento de Funcionários</h2>
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
            <SupabaseEmployeeForm 
              onSubmit={handleEmployeeSubmit}
              onCancel={() => setEmployeeDialogOpen(false)}
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
                <TableHead className="font-opensans">Cargo</TableHead>
                <TableHead className="font-opensans">Salário</TableHead>
                <TableHead className="font-opensans">Status</TableHead>
                <TableHead className="font-opensans">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee: any) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-opensans">{employee.name}</TableCell>
                  <TableCell className="font-opensans">{employee.email}</TableCell>
                  <TableCell className="font-opensans">{employee.role}</TableCell>
                  <TableCell className="font-opensans">
                    {employee.salary ? `R$ ${employee.salary.toLocaleString()}` : 'Não informado'}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-sm font-opensans ${
                      employee.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.is_active ? 'Ativo' : 'Inativo'}
                    </span>
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
                        onClick={() => handleEmployeeDelete(employee.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {employees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
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

      <Dialog open={employeeEditDialogOpen} onOpenChange={setEmployeeEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Editar Funcionário</DialogTitle>
          </DialogHeader>
          {editingEmployee && (
            <SupabaseEmployeeForm 
              initialData={editingEmployee}
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
};

export default SupabaseEmployeeManagement;
