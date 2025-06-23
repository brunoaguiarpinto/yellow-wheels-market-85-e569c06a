import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Vehicle, VehiclePurchase, VehicleStatus } from "@/types/vehicle";
import { ShoppingCart, FileText, DollarSign, Calendar } from "lucide-react";

const purchaseSchema = z.object({
  vehicleId: z.string().min(1, "Veículo é obrigatório"),
  supplier: z.string().min(1, "Fornecedor é obrigatório"),
  purchasePrice: z.number().min(0, "Preço deve ser maior que zero"),
  purchaseDate: z.string().min(1, "Data de compra é obrigatória"),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  documentation: z.array(z.string()).min(1, "Pelo menos um documento é obrigatório"),
  notes: z.string().optional(),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface VehiclePurchaseFormProps {
  onSubmit?: (data: VehiclePurchase) => void;
  onCancel?: () => void;
}

const VehiclePurchaseForm = ({ onSubmit, onCancel }: VehiclePurchaseFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      purchaseDate: new Date().toISOString().split('T')[0],
      documentation: [],
      condition: 'good'
    }
  });

  const { data: vehicles = [] } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: async () => (await api.get('/vehicles')).data,
    select: (data) => data.filter(v => v.status !== VehicleStatus.SOLD)
  });

  const mutation = useMutation({
    mutationFn: (purchaseData: Omit<VehiclePurchase, 'id' | 'createdAt' | 'employeeName'>) => api.post('/vehicle-purchases', purchaseData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehiclePurchases'] });
      toast({ title: "Compra registrada!", description: "A compra do veículo foi registrada com sucesso." });
      form.reset();
      onSubmit?.(data.data);
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível registrar a compra.", variant: "destructive" });
    }
  });

  const documentTypes = [
    'DUT (Documento Único de Transferência)',
    'Certificado de Registro de Veículo',
    'Nota Fiscal',
    'Comprovante de Quitação',
    'Laudo de Vistoria',
    'Outros documentos'
  ];

  const handleSubmit = (data: PurchaseFormData) => {
    const purchaseData: Omit<VehiclePurchase, 'id' | 'createdAt' | 'employeeName'> = {
      vehicleId: data.vehicleId,
      supplier: data.supplier,
      purchasePrice: data.purchasePrice,
      purchaseDate: data.purchaseDate,
      condition: data.condition,
      documentation: data.documentation,
      notes: data.notes,
      employeeId: user?.id || '',
    };
    mutation.mutate(purchaseData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Registrar Compra de Veículo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Campos do formulário... */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicleId" className="font-opensans">Veículo *</Label>
              <Select onValueChange={(value) => form.setValue("vehicleId", value)}>
                <SelectTrigger className="font-opensans">
                  <SelectValue placeholder="Selecione o veículo..." />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.vehicleId && (
                <p className="text-red-500 text-sm">{form.formState.errors.vehicleId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="supplier" className="font-opensans">Fornecedor *</Label>
              <Input 
                id="supplier" 
                {...form.register("supplier")}
                placeholder="Nome do fornecedor" 
                className="font-opensans" 
              />
              {form.formState.errors.supplier && (
                <p className="text-red-500 text-sm">{form.formState.errors.supplier.message}</p>
              )}
            </div>
          </div>
          {/* ... (resto do formulário) */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel} className="font-opensans">
              Cancelar
            </Button>
            <Button type="submit" className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold" disabled={mutation.isPending}>
              {mutation.isPending ? 'Registrando...' : 'Registrar Compra'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehiclePurchaseForm;
