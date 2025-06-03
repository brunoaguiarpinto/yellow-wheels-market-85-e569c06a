
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { VehiclePurchase, VehicleStatus } from "@/types/vehicle";
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
  
  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      purchaseDate: new Date().toISOString().split('T')[0],
      documentation: [],
      condition: 'good'
    }
  });

  const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
    .filter((v: any) => v.status !== VehicleStatus.SOLD);

  const documentTypes = [
    'DUT (Documento Único de Transferência)',
    'Certificado de Registro de Veículo',
    'Nota Fiscal',
    'Comprovante de Quitação',
    'Laudo de Vistoria',
    'Outros documentos'
  ];

  const handleSubmit = (data: PurchaseFormData) => {
    const purchase: VehiclePurchase = {
      id: Date.now().toString(),
      vehicleId: data.vehicleId,
      supplier: data.supplier,
      purchasePrice: data.purchasePrice,
      purchaseDate: data.purchaseDate,
      condition: data.condition,
      documentation: data.documentation,
      notes: data.notes,
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      createdAt: new Date().toISOString()
    };

    // Salvar compra
    const existingPurchases = JSON.parse(localStorage.getItem('vehiclePurchases') || '[]');
    existingPurchases.push(purchase);
    localStorage.setItem('vehiclePurchases', JSON.stringify(existingPurchases));

    // Atualizar veículo com informações de compra e status
    const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    const updatedVehicles = vehicles.map((vehicle: any) => {
      if (vehicle.id === data.vehicleId) {
        return {
          ...vehicle,
          status: VehicleStatus.AVAILABLE,
          purchaseInfo: purchase,
          updatedAt: new Date().toISOString()
        };
      }
      return vehicle;
    });
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));

    // Registrar no histórico
    const history = JSON.parse(localStorage.getItem('vehicleHistory') || '[]');
    history.push({
      id: Date.now().toString(),
      vehicleId: data.vehicleId,
      action: 'purchased',
      newStatus: VehicleStatus.AVAILABLE,
      details: `Comprado de ${data.supplier} por R$ ${data.purchasePrice.toLocaleString()}`,
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('vehicleHistory', JSON.stringify(history));

    onSubmit?.(purchase);
    toast({
      title: "Compra registrada!",
      description: "A compra do veículo foi registrada com sucesso.",
    });
    form.reset();
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
          {/* Informações básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicleId" className="font-opensans">Veículo *</Label>
              <Select onValueChange={(value) => form.setValue("vehicleId", value)}>
                <SelectTrigger className="font-opensans">
                  <SelectValue placeholder="Selecione o veículo..." />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle: any) => (
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

          {/* Informações financeiras */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="purchasePrice" className="font-opensans flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Preço de Compra (R$) *
              </Label>
              <Input 
                id="purchasePrice" 
                type="number"
                {...form.register("purchasePrice", { valueAsNumber: true })}
                placeholder="25000" 
                className="font-opensans" 
              />
              {form.formState.errors.purchasePrice && (
                <p className="text-red-500 text-sm">{form.formState.errors.purchasePrice.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="purchaseDate" className="font-opensans flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data de Compra *
              </Label>
              <Input 
                id="purchaseDate" 
                type="date"
                {...form.register("purchaseDate")}
                className="font-opensans" 
              />
              {form.formState.errors.purchaseDate && (
                <p className="text-red-500 text-sm">{form.formState.errors.purchaseDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="condition" className="font-opensans">Condição *</Label>
              <Select 
                value={form.watch("condition")} 
                onValueChange={(value: any) => form.setValue("condition", value)}
              >
                <SelectTrigger className="font-opensans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excelente</SelectItem>
                  <SelectItem value="good">Boa</SelectItem>
                  <SelectItem value="fair">Regular</SelectItem>
                  <SelectItem value="poor">Ruim</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Documentação */}
          <div>
            <Label className="font-opensans flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentação *
            </Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {documentTypes.map((doc) => (
                <div key={doc} className="flex items-center space-x-2">
                  <Checkbox 
                    id={doc}
                    checked={form.watch("documentation")?.includes(doc) || false}
                    onCheckedChange={(checked) => {
                      const current = form.getValues("documentation") || [];
                      if (checked) {
                        form.setValue("documentation", [...current, doc]);
                      } else {
                        form.setValue("documentation", current.filter(d => d !== doc));
                      }
                    }}
                  />
                  <Label htmlFor={doc} className="font-opensans text-sm">
                    {doc}
                  </Label>
                </div>
              ))}
            </div>
            {form.formState.errors.documentation && (
              <p className="text-red-500 text-sm">{form.formState.errors.documentation.message}</p>
            )}
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="notes" className="font-opensans">Observações</Label>
            <Textarea 
              id="notes" 
              {...form.register("notes")}
              placeholder="Observações sobre a compra..." 
              className="font-opensans" 
              rows={3}
            />
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
              Registrar Compra
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehiclePurchaseForm;
