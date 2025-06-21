
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AppointmentFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  customers?: { id: string; name: string; }[];
}

const AppointmentForm = ({ initialData, onSubmit, onCancel, customers = [] }: AppointmentFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    type: initialData?.type || "meeting",
    status: initialData?.status || "scheduled",
    customerId: initialData?.customerId || "",
    customerName: initialData?.customerName || "",
    reminder: initialData?.reminder || true,
    reminderTime: initialData?.reminderTime || 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
        />
      </div>

      {customers.length > 0 && (
        <div>
          <Label htmlFor="customer">Cliente</Label>
          <Select value={formData.customerId} onValueChange={(value) => {
            const customer = customers.find(c => c.id === value);
            setFormData({
              ...formData, 
              customerId: value,
              customerName: customer?.name || ""
            });
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Data *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Hora *</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({...formData, time: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="test_drive">Test Drive</SelectItem>
              <SelectItem value="meeting">Reunião</SelectItem>
              <SelectItem value="call_back">Retorno de Ligação</SelectItem>
              <SelectItem value="documentation">Documentação</SelectItem>
              <SelectItem value="delivery">Entrega</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="confirmed">Confirmado</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
              <SelectItem value="no_show">Não Compareceu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1">
          {initialData ? "Atualizar" : "Criar"} Agendamento
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
