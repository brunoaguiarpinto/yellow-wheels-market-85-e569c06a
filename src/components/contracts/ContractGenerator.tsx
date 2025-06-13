
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract, ContractStatus, ContractClause, PaymentTerms } from "@/types/contracts";

interface ContractGeneratorProps {
  onContractGenerated: (contract: Contract) => void;
  onCancel: () => void;
}

const ContractGenerator = ({ onContractGenerated, onCancel }: ContractGeneratorProps) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [observations, setObservations] = useState("");
  
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>({
    paymentMethod: 'cash'
  });

  const [clauses, setClauses] = useState<ContractClause[]>([
    {
      id: "1",
      title: "Objeto do Contrato",
      content: "O presente contrato tem por objeto a compra e venda do veículo descrito acima.",
      isEditable: true,
      order: 1
    },
    {
      id: "2", 
      title: "Preço e Forma de Pagamento",
      content: "O preço total do veículo é de R$ [VALOR], a ser pago conforme condições acordadas.",
      isEditable: true,
      order: 2
    },
    {
      id: "3",
      title: "Entrega do Veículo",
      content: "O veículo será entregue em perfeitas condições de funcionamento e com toda documentação regularizada.",
      isEditable: true,
      order: 3
    }
  ]);

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

  const handleClauseChange = (id: string, content: string) => {
    setClauses(prev => prev.map(clause => 
      clause.id === id ? { ...clause, content } : clause
    ));
  };

  const generateContract = () => {
    if (!selectedCustomer || !selectedVehicle || !selectedEmployee || !salePrice) {
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomer);
    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    const employee = employees.find(e => e.id === selectedEmployee);

    const contract: Contract = {
      id: Date.now().toString(),
      contractNumber: `CONT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      customerId: customer.id,
      customerName: customer.name,
      vehicleId: vehicle.id,
      vehicleBrand: vehicle.brand,
      vehicleModel: vehicle.model,
      vehicleYear: vehicle.year,
      salePrice: parseFloat(salePrice),
      employeeId: employee.id,
      employeeName: employee.name,
      status: ContractStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      clauses,
      observations,
      paymentTerms
    };

    onContractGenerated(contract);
  };

  return (
    <div className="space-y-6">
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cláusulas do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {clauses.map((clause) => (
            <div key={clause.id} className="space-y-2">
              <Label>{clause.title}</Label>
              <Textarea
                value={clause.content}
                onChange={(e) => handleClauseChange(clause.id, e.target.value)}
                rows={3}
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
