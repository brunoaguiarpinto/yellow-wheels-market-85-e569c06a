
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseData } from "@/hooks/useSupabaseData";

interface SaleFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const SaleForm = ({ initialData, onSubmit, onCancel }: SaleFormProps) => {
  const [formData, setFormData] = useState({
    customer_id: initialData?.customer_id || "",
    vehicle_id: initialData?.vehicle_id || "",
    employee_id: initialData?.employee_id || "",
    sale_price: initialData?.sale_price || "",
    down_payment: initialData?.down_payment || "",
    financing_amount: initialData?.financing_amount || "",
    payment_method: initialData?.payment_method || "",
    sale_date: initialData?.sale_date || new Date().toISOString().split('T')[0],
    notes: initialData?.notes || "",
  });

  const { data: customers } = useSupabaseData('customers');
  const { data: vehicles } = useSupabaseData('vehicles');
  const { data: employees } = useSupabaseData('employees');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      sale_price: Number(formData.sale_price),
      down_payment: Number(formData.down_payment) || 0,
      financing_amount: Number(formData.financing_amount) || 0,
    };
    
    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {initialData ? "Editar Venda" : "Nova Venda"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_id">Cliente *</Label>
                <Select value={formData.customer_id} onValueChange={(value) => setFormData({...formData, customer_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vehicle_id">Veículo *</Label>
                <Select value={formData.vehicle_id} onValueChange={(value) => setFormData({...formData, vehicle_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o veículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle: any) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.brand} {vehicle.model} {vehicle.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="employee_id">Vendedor *</Label>
                <Select value={formData.employee_id} onValueChange={(value) => setFormData({...formData, employee_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee: any) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sale_date">Data da Venda *</Label>
                <Input
                  id="sale_date"
                  type="date"
                  value={formData.sale_date}
                  onChange={(e) => setFormData({...formData, sale_date: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sale_price">Valor da Venda *</Label>
                <Input
                  id="sale_price"
                  type="number"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={(e) => setFormData({...formData, sale_price: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="down_payment">Valor de Entrada</Label>
                <Input
                  id="down_payment"
                  type="number"
                  step="0.01"
                  value={formData.down_payment}
                  onChange={(e) => setFormData({...formData, down_payment: e.target.value})}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="financing_amount">Valor Financiado</Label>
                <Input
                  id="financing_amount"
                  type="number"
                  step="0.01"
                  value={formData.financing_amount}
                  onChange={(e) => setFormData({...formData, financing_amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="payment_method">Forma de Pagamento *</Label>
                <Select value={formData.payment_method} onValueChange={(value) => setFormData({...formData, payment_method: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">À Vista</SelectItem>
                    <SelectItem value="financing">Financiamento</SelectItem>
                    <SelectItem value="installments">Parcelado</SelectItem>
                    <SelectItem value="exchange">Troca</SelectItem>
                    <SelectItem value="mixed">Misto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observações sobre a venda..."
                rows={3}
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" className="flex-1">
                {initialData ? "Atualizar" : "Registrar"} Venda
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SaleForm;
