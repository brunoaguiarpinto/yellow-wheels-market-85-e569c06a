
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Shield, Key } from "lucide-react";

const employeeSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  cpf: z.string().min(11, "CPF é obrigatório"),
  position: z.string().min(1, "Cargo é obrigatório"),
  department: z.string().min(1, "Departamento é obrigatório"),
  commissionRate: z.number().min(0).max(100),
  permissions: z.array(z.string()).optional(),
  address: z.string().optional(),
  hireDate: z.string().min(1, "Data de contratação é obrigatória"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  onSubmit?: (data: EmployeeFormData & { id: string; password: string }) => void;
  onCancel?: () => void;
}

const EmployeeForm = ({ onSubmit, onCancel }: EmployeeFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      commissionRate: 5,
      permissions: []
    }
  });

  const generateCredentials = (name: string, email: string) => {
    const id = `EMP${Date.now()}`;
    const password = `${name.split(' ')[0].toLowerCase()}${Math.floor(Math.random() * 1000)}`;
    return { id, password };
  };

  const handleSubmit = (data: EmployeeFormData) => {
    const credentials = generateCredentials(data.name, data.email);
    
    const employeeData = {
      ...data,
      id: credentials.id,
      password: credentials.password,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    onSubmit?.(employeeData);
    
    toast({
      title: "Funcionário cadastrado!",
      description: `Login: ${data.email} | Senha: ${credentials.password}`,
    });
  };

  const permissions = [
    { id: 'vehicles_create', label: 'Criar Veículos' },
    { id: 'vehicles_edit', label: 'Editar Veículos' },
    { id: 'vehicles_delete', label: 'Excluir Veículos' },
    { id: 'customers_create', label: 'Criar Clientes' },
    { id: 'customers_edit', label: 'Editar Clientes' },
    { id: 'financial_view', label: 'Ver Financeiro' },
    { id: 'reports_view', label: 'Ver Relatórios' },
  ];

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Dados Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat flex items-center gap-2">
            <User className="h-5 w-5" />
            Dados Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="font-opensans">Nome Completo *</Label>
              <Input 
                id="name" 
                {...form.register("name")}
                placeholder="Ex: João Silva" 
                className="font-opensans" 
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="cpf" className="font-opensans">CPF *</Label>
              <Input 
                id="cpf" 
                {...form.register("cpf")}
                placeholder="000.000.000-00" 
                className="font-opensans" 
              />
              {form.formState.errors.cpf && (
                <p className="text-red-500 text-sm">{form.formState.errors.cpf.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="font-opensans">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="email" 
                  type="email"
                  {...form.register("email")}
                  placeholder="joao@lordveiculos.com" 
                  className="font-opensans pl-10" 
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="font-opensans">Telefone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input 
                  id="phone" 
                  {...form.register("phone")}
                  placeholder="(11) 99999-9999" 
                  className="font-opensans pl-10" 
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="address" className="font-opensans">Endereço</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="address" 
                {...form.register("address")}
                placeholder="Rua das Flores, 123 - Centro" 
                className="font-opensans pl-10" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados Profissionais */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Dados Profissionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="position" className="font-opensans">Cargo *</Label>
              <Select onValueChange={(value) => form.setValue("position", value)}>
                <SelectTrigger className="font-opensans">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                  <SelectItem value="gerente">Gerente de Vendas</SelectItem>
                  <SelectItem value="financeiro">Analista Financeiro</SelectItem>
                  <SelectItem value="atendimento">Atendimento ao Cliente</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.position && (
                <p className="text-red-500 text-sm">{form.formState.errors.position.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="department" className="font-opensans">Departamento *</Label>
              <Select onValueChange={(value) => form.setValue("department", value)}>
                <SelectTrigger className="font-opensans">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="atendimento">Atendimento</SelectItem>
                  <SelectItem value="administracao">Administração</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.department && (
                <p className="text-red-500 text-sm">{form.formState.errors.department.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hireDate" className="font-opensans">Data de Contratação *</Label>
              <Input 
                id="hireDate" 
                type="date"
                {...form.register("hireDate")}
                className="font-opensans" 
              />
              {form.formState.errors.hireDate && (
                <p className="text-red-500 text-sm">{form.formState.errors.hireDate.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="commissionRate" className="font-opensans">Taxa de Comissão (%)</Label>
            <Input 
              id="commissionRate" 
              type="number"
              min="0"
              max="100"
              {...form.register("commissionRate", { valueAsNumber: true })}
              placeholder="5" 
              className="font-opensans" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Permissões */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat flex items-center gap-2">
            <Key className="h-5 w-5" />
            Permissões do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={permission.id}
                  onCheckedChange={(checked) => {
                    const currentPermissions = form.getValues("permissions") || [];
                    if (checked) {
                      form.setValue("permissions", [...currentPermissions, permission.id]);
                    } else {
                      form.setValue("permissions", currentPermissions.filter(p => p !== permission.id));
                    }
                  }}
                />
                <Label htmlFor={permission.id} className="font-opensans text-sm">
                  {permission.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="font-opensans"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold"
        >
          Cadastrar Funcionário
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
