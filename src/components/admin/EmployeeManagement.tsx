
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash, Eye, EyeOff } from "lucide-react";
import EmployeeForm from "@/components/EmployeeForm";
import EmployeeEditForm from "@/components/EmployeeEditForm";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  permissions: string[];
  password: string;
}

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
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [employeeEditDialogOpen, setEmployeeEditDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  const handleEmployeeEdit = (employee: any) => {
    setEditingEmployee(employee);
    setEmployeeEditDialogOpen(true);
  };

  const handleEmployeeUpdate = (data: any) => {
    onEmployeeUpdate(data);
    setEmployeeEditDialogOpen(false);
    setEditingEmployee(null);
  };

  const togglePasswordVisibility = (employeeId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
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
                        onClick={() => onEmployeeDelete(employee.id)}
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
    </div>
  );
};

export default EmployeeManagement;
