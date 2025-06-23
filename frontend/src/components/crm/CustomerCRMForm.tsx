
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CustomerOrigin, CustomerStatus, Priority } from "@/types/crm";

const customerCRMSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  whatsapp: z.string().optional(),
  origin: z.nativeEnum(CustomerOrigin),
  status: z.nativeEnum(CustomerStatus),
  vehicleInterest: z.string().optional(),
  priceRange: z.string().optional(),
  priority: z.nativeEnum(Priority),
  assignedEmployee: z.string().optional(),
  nextFollowUp: z.string().optional(),
  observations: z.string().optional(),
});

type CustomerCRMFormData = z.infer<typeof customerCRMSchema>;

interface CustomerCRMFormProps {
  onSubmit: (data: CustomerCRMFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CustomerCRMFormData>;
}

const CustomerCRMForm = ({ onSubmit, onCancel, initialData }: CustomerCRMFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<CustomerCRMFormData>({
    resolver: zodResolver(customerCRMSchema),
    defaultValues: {
      status: CustomerStatus.PROSPECT,
      priority: Priority.MEDIUM,
      ...initialData,
    }
  });

  const handleSubmit = (data: CustomerCRMFormData) => {
    onSubmit(data);
    if (!initialData) {
      form.reset();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Dados Básicos */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Básicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input 
                id="name" 
                {...form.register("name")}
                placeholder="João Silva" 
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email"
                {...form.register("email")}
                placeholder="joao@email.com" 
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input 
                id="phone" 
                {...form.register("phone")}
                placeholder="(11) 99999-9999" 
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input 
                id="whatsapp" 
                {...form.register("whatsapp")}
                placeholder="(11) 99999-9999" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações CRM */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de CRM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="origin">Como chegou até nós? *</Label>
              <Select onValueChange={(value) => form.setValue("origin", value as CustomerOrigin)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CustomerOrigin.WEBSITE}>Site</SelectItem>
                  <SelectItem value={CustomerOrigin.REFERRAL}>Indicação</SelectItem>
                  <SelectItem value={CustomerOrigin.SOCIAL_MEDIA}>Redes Sociais</SelectItem>
                  <SelectItem value={CustomerOrigin.WALK_IN}>Visita Presencial</SelectItem>
                  <SelectItem value={CustomerOrigin.PHONE_CALL}>Ligação</SelectItem>
                  <SelectItem value={CustomerOrigin.ADVERTISING}>Publicidade</SelectItem>
                  <SelectItem value={CustomerOrigin.PARTNER}>Parceiro</SelectItem>
                  <SelectItem value={CustomerOrigin.OTHER}>Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status do Cliente *</Label>
              <Select onValueChange={(value) => form.setValue("status", value as CustomerStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CustomerStatus.PROSPECT}>Prospect</SelectItem>
                  <SelectItem value={CustomerStatus.HOT_LEAD}>Lead Quente</SelectItem>
                  <SelectItem value={CustomerStatus.COLD_LEAD}>Lead Frio</SelectItem>
                  <SelectItem value={CustomerStatus.NEGOTIATING}>Negociando</SelectItem>
                  <SelectItem value={CustomerStatus.CLIENT}>Cliente</SelectItem>
                  <SelectItem value={CustomerStatus.LOST}>Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicleInterest">Veículo de Interesse</Label>
              <Input 
                id="vehicleInterest" 
                {...form.register("vehicleInterest")}
                placeholder="Ex: Honda Civic 2020" 
              />
            </div>
            <div>
              <Label htmlFor="priceRange">Faixa de Preço</Label>
              <Select onValueChange={(value) => form.setValue("priceRange", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-30000">Até R$ 30.000</SelectItem>
                  <SelectItem value="30000-50000">R$ 30.000 - R$ 50.000</SelectItem>
                  <SelectItem value="50000-80000">R$ 50.000 - R$ 80.000</SelectItem>
                  <SelectItem value="80000-120000">R$ 80.000 - R$ 120.000</SelectItem>
                  <SelectItem value="120000+">Acima de R$ 120.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select onValueChange={(value) => form.setValue("priority", value as Priority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Priority.LOW}>Baixa</SelectItem>
                  <SelectItem value={Priority.MEDIUM}>Média</SelectItem>
                  <SelectItem value={Priority.HIGH}>Alta</SelectItem>
                  <SelectItem value={Priority.URGENT}>Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nextFollowUp">Próximo Follow-up</Label>
              <Input 
                id="nextFollowUp" 
                type="datetime-local"
                {...form.register("nextFollowUp")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea 
              id="observations" 
              {...form.register("observations")}
              placeholder="Anotações importantes sobre o cliente..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {initialData ? 'Atualizar Cliente' : 'Salvar Cliente'}
        </Button>
      </div>
    </form>
  );
};

export default CustomerCRMForm;
