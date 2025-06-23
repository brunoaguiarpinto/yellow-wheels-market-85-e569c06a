
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskType, TaskStatus, Priority } from "@/types/crm";

const taskSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  type: z.nativeEnum(TaskType),
  priority: z.nativeEnum(Priority),
  dueDate: z.string().min(1, "Data é obrigatória"),
  dueTime: z.string().optional(),
  status: z.nativeEnum(TaskStatus),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TaskFormData>;
  customers: Array<{ id: string; name: string }>;
}

const TaskForm = ({ onSubmit, onCancel, initialData, customers }: TaskFormProps) => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: TaskStatus.PENDING,
      priority: Priority.MEDIUM,
      type: TaskType.OTHER,
      ...initialData,
    }
  });

  const handleSubmit = (data: TaskFormData) => {
    onSubmit(data);
    if (!initialData) {
      form.reset();
    }
  };

  const getTypeLabel = (type: TaskType) => {
    switch (type) {
      case TaskType.CALL: return "Ligação";
      case TaskType.EMAIL: return "Email";
      case TaskType.FOLLOW_UP: return "Follow-up";
      case TaskType.DOCUMENTATION: return "Documentação";
      case TaskType.PREPARATION: return "Preparação";
      default: return "Outros";
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT: return "Urgente";
      case Priority.HIGH: return "Alta";
      case Priority.MEDIUM: return "Média";
      case Priority.LOW: return "Baixa";
      default: return priority;
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Tarefa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input 
              id="title" 
              {...form.register("title")}
              placeholder="Ex: Ligar para cliente..." 
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
              placeholder="Detalhes da tarefa..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo de Tarefa</Label>
              <Select onValueChange={(value) => form.setValue("type", value as TaskType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TaskType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {getTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select onValueChange={(value) => form.setValue("priority", value as Priority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Priority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {getPriorityLabel(priority)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Data de Vencimento *</Label>
              <Input 
                id="dueDate" 
                type="date"
                {...form.register("dueDate")}
              />
              {form.formState.errors.dueDate && (
                <p className="text-red-500 text-sm">{form.formState.errors.dueDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dueTime">Horário</Label>
              <Input 
                id="dueTime" 
                type="time"
                {...form.register("dueTime")}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customer">Cliente (opcional)</Label>
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
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
          {initialData ? 'Atualizar Tarefa' : 'Criar Tarefa'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
