
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
          Cadastrar Funcionário
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;
