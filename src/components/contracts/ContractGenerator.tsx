
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract, ContractStatus, ContractClause, PaymentTerms, ContractType, CONTRACT_TEMPLATES, TradeInVehicle } from "@/types/contracts";

interface ContractGeneratorProps {
  onContractGenerated: (contract: Contract) => void;
  onCancel: () => void;
}

const ContractGenerator = ({ onContractGenerated, onCancel }: ContractGeneratorProps) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [contractType, setContractType] = useState<ContractType>(ContractType.SALE);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [observations, setObservations] = useState("");
  
  // Campos específicos por tipo de contrato
  const [warrantyAmount, setWarrantyAmount] = useState("");
  const [warrantyIssue, setWarrantyIssue] = useState("");
  const [consignmentDays, setConsignmentDays] = useState("30");
  const [commissionRate, setCommissionRate] = useState("5");
  const [tradeInVehicle, setTradeInVehicle] = useState<TradeInVehicle | null>(null);
  
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>({
    paymentMethod: 'cash'
  });

  const [clauses, setClauses] = useState<ContractClause[]>([]);

  useEffect(() => {
    // Carregar dados do localStorage
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }

    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles).filter((v: any) => v.status === 'available'));
    }

    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, []);

  useEffect(() => {
    // Atualizar cláusulas quando o tipo de contrato mudar
    const template = CONTRACT_TEMPLATES.find(t => t.type === contractType);
    if (template) {
      setClauses(template.clauses);
    }
  }, [contractType]);

  const handleClauseChange = (id: string, content: string) => {
    setClauses(prev => prev.map(clause => 
      clause.id === id ? { ...clause, content } : clause
    ));
  };

  const replacePlaceholders = (content: string, customer: any, vehicle: any) => {
    if (!customer || !vehicle) return content;

    return content
      .replace(/\[NOME_CLIENTE\]/g, customer.name)
      .replace(/\[CPF_CLIENTE\]/g, customer.document || customer.cpf || '')
      .replace(/\[ENDERECO_CLIENTE\]/g, `${customer.street || ''} ${customer.number || ''}, ${customer.neighborhood || ''}, ${customer.city || ''} - ${customer.state || ''}, CEP ${customer.zipCode || ''}`)
      .replace(/\[TELEFONE_CLIENTE\]/g, customer.phone || '')
      .replace(/\[MARCA\]/g, vehicle.brand)
      .replace(/\[MODELO\]/g, vehicle.model)
      .replace(/\[COR\]/g, vehicle.color)
      .replace(/\[COMBUSTIVEL\]/g, vehicle.fuel)
      .replace(/\[ANO_FABRICACAO\]/g, vehicle.year.toString())
      .replace(/\[ANO_MODELO\]/g, vehicle.year.toString())
      .replace(/\[QUILOMETRAGEM\]/g, vehicle.mileage?.toString() || '0')
      .replace(/\[PLACA\]/g, vehicle.plate || '')
      .replace(/\[CHASSI\]/g, vehicle.chassis || '')
      .replace(/\[VALOR_VENDA\]/g, `R$ ${parseFloat(salePrice || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      .replace(/\[VALOR_GARANTIA\]/g, `R$ ${parseFloat(warrantyAmount || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`)
      .replace(/\[PROBLEMA_RELATADO\]/g, warrantyIssue)
      .replace(/\[PERCENTUAL_COMISSAO\]/g, commissionRate)
      .replace(/\[PRAZO_DIAS\]/g, consignmentDays)
      .replace(/\[DATA_VENDA\]/g, new Date().toLocaleDateString('pt-BR'))
      .replace(/\[HORA_VENDA\]/g, new Date().toLocaleTimeString('pt-BR'));
  };

  const generateContract = () => {
    if (!selectedCustomer || !selectedVehicle || !selectedEmployee) {
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomer);
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    const employee = employees.find(e => e.id === selectedEmployee);

    if (!customer || !vehicle || !employee) return;

    // Substituir placeholders nas cláusulas
    const processedClauses = clauses.map(clause => ({
      ...clause,
      content: replacePlaceholders(clause.content, customer, vehicle)
    }));

    const contract: Contract = {
      id: Date.now().toString(),
      contractNumber: `CONT-${contractType.toUpperCase()}-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      contractType,
      customerId: customer.id,
      customerName: customer.name,
      customerDocument: customer.document || customer.cpf || '',
      customerAddress: `${customer.street || ''} ${customer.number || ''}, ${customer.neighborhood || ''}, ${customer.city || ''} - ${customer.state || ''}, CEP ${customer.zipCode || ''}`,
      customerPhone: customer.phone || '',
      vehicleId: vehicle.id,
      vehicleBrand: vehicle.brand,
      vehicleModel: vehicle.model,
      vehicleYear: vehicle.year,
      vehicleColor: vehicle.color,
      vehicleFuel: vehicle.fuel,
      vehiclePlate: vehicle.plate || '',
      vehicleChassis: vehicle.chassis || '',
      vehicleKm: vehicle.mileage || 0,
      salePrice: parseFloat(salePrice || '0'),
      employeeId: employee.id,
      employeeName: employee.name,
      status: ContractStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clauses: processedClauses,
      observations,
      paymentTerms,
      warrantyAmount: warrantyAmount ? parseFloat(warrantyAmount) : undefined,
      warrantyIssue: warrantyIssue || undefined,
      consignmentDays: consignmentDays ? parseInt(consignmentDays) : undefined,
      commissionRate: commissionRate ? parseFloat(commissionRate) : undefined,
      tradeInVehicle
    };

    onContractGenerated(contract);
  };

  const getContractTypeLabel = (type: ContractType) => {
    switch (type) {
      case ContractType.WARRANTY_TERM:
        return "Termo de Garantia";
      case ContractType.CONSIGNMENT:
        return "Consignação";
      case ContractType.SALE:
        return "Compra e Venda";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="contractType">Tipo de Contrato</Label>
        <Select value={contractType} onValueChange={(value: ContractType) => setContractType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar tipo de contrato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ContractType.SALE}>Contrato de Compra e Venda</SelectItem>
            <SelectItem value={ContractType.CONSIGNMENT}>Contrato de Consignação</SelectItem>
            <SelectItem value={ContractType.WARRANTY_TERM}>Termo de Garantia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="customer">Cliente</Label>
          <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar cliente" />
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

        <div>
          <Label htmlFor="vehicle">Veículo</Label>
          <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar veículo" />
            </SelectTrigger>
            <SelectContent>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} {vehicle.year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="employee">Vendedor</Label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar vendedor" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="salePrice">Valor da Venda</Label>
          <Input
            id="salePrice"
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
            placeholder="0.00"
          />
        </div>

        {contractType === ContractType.WARRANTY_TERM && (
          <>
            <div>
              <Label htmlFor="warrantyAmount">Valor da Garantia</Label>
              <Input
                id="warrantyAmount"
                type="number"
                value={warrantyAmount}
                onChange={(e) => setWarrantyAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="warrantyIssue">Problema Relatado</Label>
              <Textarea
                id="warrantyIssue"
                value={warrantyIssue}
                onChange={(e) => setWarrantyIssue(e.target.value)}
                placeholder="Descreva o problema relatado pelo cliente..."
                rows={3}
              />
            </div>
          </>
        )}

        {contractType === ContractType.CONSIGNMENT && (
          <>
            <div>
              <Label htmlFor="consignmentDays">Prazo (dias)</Label>
              <Input
                id="consignmentDays"
                type="number"
                value={consignmentDays}
                onChange={(e) => setConsignmentDays(e.target.value)}
                placeholder="30"
              />
            </div>
            <div>
              <Label htmlFor="commissionRate">Taxa de Comissão (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="5"
              />
            </div>
          </>
        )}

        {contractType === ContractType.SALE && (
          <div>
            <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
            <Select
              value={paymentTerms.paymentMethod}
              onValueChange={(value: any) => setPaymentTerms(prev => ({ ...prev, paymentMethod: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">À Vista</SelectItem>
                <SelectItem value="financing">Financiamento</SelectItem>
                <SelectItem value="mixed">Misto</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cláusulas do Contrato - {getContractTypeLabel(contractType)}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {clauses.map((clause) => (
            <div key={clause.id} className="space-y-2">
              <Label>CLÁUSULA {clause.order}ª - {clause.title}</Label>
              <Textarea
                value={clause.content}
                onChange={(e) => handleClauseChange(clause.id, e.target.value)}
                rows={4}
                className="text-sm"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div>
        <Label htmlFor="observations">Observações</Label>
        <Textarea
          id="observations"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Observações adicionais..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={generateContract}>
          Gerar Contrato
        </Button>
      </div>
    </div>
  );
};

export default ContractGenerator;
