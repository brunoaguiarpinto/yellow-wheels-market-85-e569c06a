
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentType, AppointmentStatus } from "@/types/crm";

const appointmentSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  type: z.nativeEnum(AppointmentType),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  status: z.nativeEnum(AppointmentStatus),
  customerId: z.string().min(1, "Cliente é obrigatório"),
  customerName: z.string().optional(),
  reminder: z.boolean().optional(),
  reminderTime: z.number().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AppointmentFormData>;
  customers: Array<{ id: string; name: string }>;
}

const AppointmentForm = ({ onSubmit, onCancel, initialData, customers }: AppointmentFormProps) => {
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      status: AppointmentStatus.SCHEDULED,
      type: AppointmentType.MEETING,
      reminder: true,
      reminderTime: 30,
      ...initialData,
    }
  });

  const handleSubmit = (data: AppointmentFormData) => {
    onSubmit(data);
    if (!initialData) {
      form.reset();
    }
  };

  const getTypeLabel = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.TEST_DRIVE: return "Test Drive";
      case AppointmentType.MEETING: return "Reunião";
      case AppointmentType.CALL_BACK: return "Retorno de Ligação";
      case AppointmentType.DOCUMENTATION: return "Documentação";
      case AppointmentType.DELIVERY: return "Entrega";
      default: return "Outros";
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Agendamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input 
              id="title" 
              {...form.register("title")}
              placeholder="Ex: Reunião com cliente..." 
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              {...form.register("description")}
              placeholder="Detalhes do agendamento..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo de Agendamento</Label>
            <Select onValueChange={(value) => form.setValue("type", value as AppointmentType)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {Object.values(AppointmentType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {getTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customer">Cliente *</Label>
            <Select onValueChange={(value) => {
              const customer = customers.find(c => c.id === value);
              form.setValue("customerId", value);
              form.setValue("customerName", customer?.name || "");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cliente..." />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.customerId && (
              <p className="text-red-500 text-sm">{form.formState.errors.customerId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Data *</Label>
              <Input 
                id="date" 
                type="date"
                {...form.register("date")}
              />
              {form.formState.errors.date && (
                <p className="text-red-500 text-sm">{form.formState.errors.date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="time">Horário *</Label>
              <Input 
                id="time" 
                type="time"
                {...form.register("time")}
              />
              {form.formState.errors.time && (
                <p className="text-red-500 text-sm">{form.formState.errors.time.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
          {initialData ? 'Atualizar Agendamento' : 'Criar Agendamento'}
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
