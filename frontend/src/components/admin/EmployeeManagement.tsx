
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash } from "lucide-react";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeEditForm from "@/components/EmployeeEditForm";
import ConfirmationDialog from "@/components/modals/ConfirmationDialog";
import { User as Employee } from "@/contexts/AuthContext";

interface EmployeeManagementProps {
  employees: Employee[];
  onEmployeeSubmit: (data: any) => void;
  onEmployeeUpdate: (data: any) => void;
  onEmployeeDelete: (employeeId: string) => void;
}

const EmployeeManagement = ({ 
  employees, 
  onEmployeeSubmit, 
  onEmployeeUpdate, 
  onEmployeeDelete 
}: EmployeeManagementProps) => {
  const { toast } = useToast();
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [employeeEditDialogOpen, setEmployeeEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleEmployeeEdit = (employee: any) => {
    setEditingEmployee(employee);
    setEmployeeEditDialogOpen(true);
  };

  const handleEmployeeUpdate = (data: any) => {
    onEmployeeUpdate(data);
    setEmployeeEditDialogOpen(false);
    setEditingEmployee(null);
  };

  const handleDeleteClick = (employee: Employee) => {
    setDeletingEmployee(employee);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingEmployee) {
      onEmployeeDelete(deletingEmployee.id);
      toast({
        title: "Funcionário excluído!",
        description: `O funcionário ${deletingEmployee.name} foi removido do sistema.`,
        variant: "destructive",
      });
      setDeletingEmployee(null);
    }
    setIsConfirmOpen(false);
  };

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
                onSubmit={(data) => {
                  onEmployeeSubmit(data);
                  setEmployeeDialogOpen(false);
                  toast({
                    title: "Funcionário cadastrado!",
                    description: `Um e-mail foi enviado para ${data.email} para que o funcionário configure sua senha.`,
                  });
                }}
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
                <TableHead className="font-opensans">Role</TableHead>
                <TableHead className="font-opensans">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-opensans">{employee.name}</TableCell>
                  <TableCell className="font-opensans">{employee.email}</TableCell>
                  <TableCell className="font-opensans">{employee.role}</TableCell>
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
                        onClick={() => handleDeleteClick(employee)}
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

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Confirmar Exclusão`}
        description={`Tem certeza de que deseja excluir o funcionário ${deletingEmployee?.name}? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default EmployeeManagement;
