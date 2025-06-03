
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const saleSchema = z.object({
  vehicleId: z.string().min(1, "Veículo é obrigatório"),
  clientId: z.string().min(1, "Cliente é obrigatório"),
  salePrice: z.string().min(1, "Preço de venda é obrigatório"),
  commission: z.string().min(1, "Comissão é obrigatória"),
  saleDate: z.string().min(1, "Data da venda é obrigatória"),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SalesFormProps {
  onSubmit?: (data: SaleFormData) => void;
  onCancel?: () => void;
}

const SalesForm = ({ onSubmit, onCancel }: SalesFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [vehicles] = useState(() => JSON.parse(localStorage.getItem('vehicles') || '[]'));
  const [clients] = useState(() => JSON.parse(localStorage.getItem('customers') || '[]'));
  
  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      saleDate: new Date().toISOString().split('T')[0]
    }
  });

  const handleSubmit = (data: SaleFormData) => {
    const sale = {
      id: Date.now().toString(),
      ...data,
      employeeId: user?.id,
      employeeName: user?.name,
      createdAt: new Date().toISOString()
    };

    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    existingSales.push(sale);
    localStorage.setItem('sales', JSON.stringify(existingSales));

    onSubmit?.(data);
    toast({
      title: "Venda registrada!",
      description: "A venda foi cadastrada com sucesso.",
    });
    form.reset();
  };

  // Filter out items with empty or invalid IDs
  const validVehicles = vehicles.filter((vehicle: any) => vehicle && vehicle.id && vehicle.id.toString().trim() !== '');
  const validClients = clients.filter((client: any) => client && client.id && client.id.toString().trim() !== '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat">Registrar Nova Venda</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicleId" className="font-opensans">Veículo *</Label>
              <Select onValueChange={(value) => form.setValue("vehicleId", value)}>
                <SelectTrigger className="font-opensans">
                  <SelectValue placeholder="Selecione o veículo..." />
                </SelectTrigger>
                <SelectContent>
                  {validVehicles.length > 0 ? (
                    validVehicles.map((vehicle: any) => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        {vehicle.brand} {vehicle.model} - {vehicle.year}
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
              <Label htmlFor="clientId" className="font-opensans">Cliente *</Label>
              <Select onValueChange={(value) => form.setValue("clientId", value)}>
                <SelectTrigger className="font-opensans">
                  <SelectValue placeholder="Selecione o cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {validClients.length > 0 ? (
                    validClients.map((client: any) => (
                      <SelectItem key={client.id} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-clients" disabled>
                      Nenhum cliente disponível
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {form.formState.errors.clientId && (
                <p className="text-red-500 text-sm">{form.formState.errors.clientId.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="salePrice" className="font-opensans">Preço de Venda (R$) *</Label>
              <Input 
                id="salePrice" 
                {...form.register("salePrice")}
                placeholder="50000" 
                className="font-opensans" 
              />
              {form.formState.errors.salePrice && (
                <p className="text-red-500 text-sm">{form.formState.errors.salePrice.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="commission" className="font-opensans">Comissão (%) *</Label>
              <Input 
                id="commission" 
                {...form.register("commission")}
                placeholder="5" 
                className="font-opensans" 
              />
              {form.formState.errors.commission && (
                <p className="text-red-500 text-sm">{form.formState.errors.commission.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="saleDate" className="font-opensans">Data da Venda *</Label>
              <Input 
                id="saleDate" 
                type="date"
                {...form.register("saleDate")}
                className="font-opensans" 
              />
              {form.formState.errors.saleDate && (
                <p className="text-red-500 text-sm">{form.formState.errors.saleDate.message}</p>
              )}
            </div>
          </div>

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
              Registrar Venda
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SalesForm;
