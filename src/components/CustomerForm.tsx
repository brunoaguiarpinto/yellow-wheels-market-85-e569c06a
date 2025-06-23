
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import PersonalInfoSection from "./customer/PersonalInfoSection";
import ContactInfoSection from "./customer/ContactInfoSection";
import AddressSection from "./customer/AddressSection";
import PreferencesSection from "./customer/PreferencesSection";

const customerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF é obrigatório"),
  rg: z.string().optional(),
  birthDate: z.string().optional(),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  whatsapp: z.string().optional(),
  address: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zipCode: z.string().min(8, "CEP é obrigatório"),
  vehicleInterest: z.string().optional(),
  priceRange: z.string().optional(),
  financingInterest: z.boolean().optional(),
  observations: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

import { useEffect } from "react";
import { Customer } from "@/types/crm";

interface CustomerFormProps {
  onSubmit?: (data: CustomerFormData) => void;
  onCancel?: () => void;
  initialData?: Customer | null;
}

const CustomerForm = ({ onSubmit, onCancel, initialData }: CustomerFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      financingInterest: false,
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const handleSubmit = (data: CustomerFormData) => {
    onSubmit?.(data);
    toast({
      title: "Cliente cadastrado!",
      description: "O cliente foi adicionado com sucesso.",
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <PersonalInfoSection 
        register={form.register}
        errors={form.formState.errors}
      />

      <ContactInfoSection 
        register={form.register}
        errors={form.formState.errors}
      />

      <AddressSection 
        register={form.register}
        setValue={form.setValue}
        errors={form.formState.errors}
      />

      <PreferencesSection 
        register={form.register}
        setValue={form.setValue}
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
          Salvar Cliente
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
