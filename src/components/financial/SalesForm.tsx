
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const saleSchema = z.object({
  vehicleId: z.string().min(1, "Veículo é obrigatório"),
  customerName: z.string().min(1, "Nome do cliente é obrigatório"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(1, "Telefone é obrigatório"),
  salePrice: z.string().min(1, "Preço de venda é obrigatório"),
  paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
  notes: z.string().optional(),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SalesFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SalesForm = ({ onSubmit, onCancel }: SalesFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [vehicles] = useState(() => {
    const allVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    return allVehicles.filter((v: any) => v.status !== 'vendido');
  });
  
  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
  });

  const handleSubmit = (data: SaleFormData) => {
    const saleData = {
      ...data,
      vehicleId: data.vehicleId,
      salePrice: parseFloat(data.salePrice),
    };

    onSubmit(saleData);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicleId">Veículo *</Label>
          <Select onValueChange={(value) => form.setValue("vehicleId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o veículo..." />
            </SelectTrigger>
            <SelectContent>
              {vehicles.length > 0 ? (
                vehicles.map((vehicle: any) => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.brand} {vehicle.model} - {vehicle.year} (R$ {vehicle.price?.toLocaleString()})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-vehicles" disabled>
                  Nenhum veículo disponível
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {form.formState.errors.vehicleId && (
            <p className="text-red-500 text-sm">{form.formState.errors.vehicleId.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="salePrice">Preço de Venda (R$) *</Label>
          <Input 
            id="salePrice" 
            {...form.register("salePrice")}
            placeholder="85000" 
            type="number"
          />
          {form.formState.errors.salePrice && (
            <p className="text-red-500 text-sm">{form.formState.errors.salePrice.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Nome do Cliente *</Label>
          <Input 
            id="customerName" 
            {...form.register("customerName")}
            placeholder="João Silva" 
          />
          {form.formState.errors.customerName && (
            <p className="text-red-500 text-sm">{form.formState.errors.customerName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="customerEmail">Email do Cliente *</Label>
          <Input 
            id="customerEmail" 
            {...form.register("customerEmail")}
            placeholder="joao@email.com" 
            type="email"
          />
          {form.formState.errors.customerEmail && (
            <p className="text-red-500 text-sm">{form.formState.errors.customerEmail.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerPhone">Telefone do Cliente *</Label>
          <Input 
            id="customerPhone" 
            {...form.register("customerPhone")}
            placeholder="(11) 99999-9999" 
          />
          {form.formState.errors.customerPhone && (
            <p className="text-red-500 text-sm">{form.formState.errors.customerPhone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="paymentMethod">Método de Pagamento *</Label>
          <Select onValueChange={(value) => form.setValue("paymentMethod", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o método..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vista">À Vista</SelectItem>
              <SelectItem value="financiamento">Financiamento</SelectItem>
              <SelectItem value="consorcio">Consórcio</SelectItem>
              <SelectItem value="entrada-financiamento">Entrada + Financiamento</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.paymentMethod && (
            <p className="text-red-500 text-sm">{form.formState.errors.paymentMethod.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Observações</Label>
        <Textarea 
          id="notes" 
          {...form.register("notes")}
          placeholder="Informações adicionais sobre a venda..."
          rows={3}
        />
      </div>

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
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Registrar Venda
        </Button>
      </div>
    </form>
  );
};

export default SalesForm;
