
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PersonalDataSection from "./employee/PersonalDataSection";
import ProfessionalDataSection from "./employee/ProfessionalDataSection";
import PermissionsSection from "./employee/PermissionsSection";

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

interface EmployeeEditFormProps {
  employee: any;
  onSubmit?: (data: EmployeeFormData & { id: string }) => void;
  onCancel?: () => void;
}

const EmployeeEditForm = ({ employee, onSubmit, onCancel }: EmployeeEditFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      cpf: employee.cpf || '',
      position: employee.position || '',
      department: employee.department || '',
      commissionRate: employee.commissionRate || 5,
      permissions: employee.permissions || [],
      address: employee.address || '',
      hireDate: employee.hireDate || ''
    }
  });

  const handleSubmit = (data: EmployeeFormData) => {
    const updatedEmployee = {
      ...data,
      id: employee.id,
      password: employee.password,
      createdAt: employee.createdAt,
      status: employee.status
    };

    onSubmit?.(updatedEmployee);
    
    toast({
      title: "Funcionário atualizado!",
      description: "Os dados do funcionário foram atualizados com sucesso.",
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <PersonalDataSection 
        register={form.register}
        errors={form.formState.errors}
      />

      <ProfessionalDataSection 
        register={form.register}
        setValue={form.setValue}
        watch={form.watch}
        errors={form.formState.errors}
      />

      <PermissionsSection 
        getValues={form.getValues}
        setValue={form.setValue}
        watch={form.watch}
      />

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
          Atualizar Funcionário
        </Button>
      </div>
    </form>
  );
};

export default EmployeeEditForm;
