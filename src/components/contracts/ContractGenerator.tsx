
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseData, useSupabaseInsert } from "@/hooks/useSupabaseData";

interface ContractGeneratorProps {
  onContractGenerated: () => void;
  onCancel: () => void;
}

const ContractGenerator = ({ onContractGenerated, onCancel }: ContractGeneratorProps) => {
  const [contractData, setContractData] = useState({
    contractType: "sale",
    customerId: "",
    vehicleId: "",
    employeeId: "",
    salePrice: "",
    warrantyAmount: "",
    warrantyIssue: "",
    consignmentDays: "",
    commissionRate: "",
    observations: ""
  });

  const { toast } = useToast();
  const { insert: insertContract, loading } = useSupabaseInsert('contracts');
  const { data: customers } = useSupabaseData('customers');
  const { data: vehicles } = useSupabaseData('vehicles');
  const { data: employees } = useSupabaseData('employees');

  const handleChange = (field: string, value: string) => {
    setContractData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateContractNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CONT-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contractData.customerId || !contractData.vehicleId || !contractData.employeeId || !contractData.salePrice) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const contractNumber = generateContractNumber();

    const newContract = {
      contract_number: contractNumber,
      contract_type: contractData.contractType,
      customer_id: contractData.customerId,
      vehicle_id: contractData.vehicleId,
      employee_id: contractData.employeeId,
      sale_price: parseFloat(contractData.salePrice),
      warranty_amount: contractData.warrantyAmount ? parseFloat(contractData.warrantyAmount) : null,
      warranty_issue: contractData.warrantyIssue || null,
      consignment_days: contractData.consignmentDays ? parseInt(contractData.consignmentDays) : null,
      commission_rate: contractData.commissionRate ? parseFloat(contractData.commissionRate) : null,
      observations: contractData.observations || null,
      status: 'draft'
    };

    console.log('Creating contract:', newContract);

    const result = await insertContract(newContract);
    if (result) {
      onContractGenerated();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contractType">Tipo de Contrato *</Label>
              <Select value={contractData.contractType} onValueChange={(value) => handleChange("contractType", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Compra/Venda</SelectItem>
                  <SelectItem value="consignment">Consignação</SelectItem>
                  <SelectItem value="warranty_term">Termo de Garantia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="salePrice">Valor da Venda *</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                value={contractData.salePrice}
                onChange={(e) => handleChange("salePrice", e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Partes Envolvidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="customerId">Cliente *</Label>
              <Select value={contractData.customerId} onValueChange={(value) => handleChange("customerId", value)}>
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
              <Label htmlFor="vehicleId">Veículo *</Label>
              <Select value={contractData.vehicleId} onValueChange={(value) => handleChange("vehicleId", value)}>
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
              <Label htmlFor="employeeId">Vendedor *</Label>
              <Select value={contractData.employeeId} onValueChange={(value) => handleChange("employeeId", value)}>
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
          </div>
        </CardContent>
      </Card>

      {contractData.contractType === "warranty_term" && (
        <Card>
          <CardHeader>
            <CardTitle>Informações da Garantia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="warrantyAmount">Valor da Garantia</Label>
                <Input
                  id="warrantyAmount"
                  type="number"
                  step="0.01"
                  value={contractData.warrantyAmount}
                  onChange={(e) => handleChange("warrantyAmount", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="warrantyIssue">Problema Coberto pela Garantia</Label>
              <Textarea
                id="warrantyIssue"
                value={contractData.warrantyIssue}
                onChange={(e) => handleChange("warrantyIssue", e.target.value)}
                placeholder="Descreva o problema que será coberto pela garantia..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {contractData.contractType === "consignment" && (
        <Card>
          <CardHeader>
            <CardTitle>Informações da Consignação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="consignmentDays">Prazo de Consignação (dias)</Label>
                <Input
                  id="consignmentDays"
                  type="number"
                  value={contractData.consignmentDays}
                  onChange={(e) => handleChange("consignmentDays", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="commissionRate">Taxa de Comissão (%)</Label>
                <Input
                  id="commissionRate"
                  type="number"
                  step="0.01"
                  value={contractData.commissionRate}
                  onChange={(e) => handleChange("commissionRate", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Observações Adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={contractData.observations}
              onChange={(e) => handleChange("observations", e.target.value)}
              placeholder="Adicione observações específicas para este contrato..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Gerando..." : "Gerar Contrato"}
        </Button>
      </div>
    </form>
  );
};

export default ContractGenerator;
