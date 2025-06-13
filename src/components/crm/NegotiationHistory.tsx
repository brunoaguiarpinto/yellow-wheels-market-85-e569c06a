
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingDown, DollarSign, Percent, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NegotiationRecord {
  id: string;
  vehicleId: string;
  vehicleInfo: string;
  customerId: string;
  customerName: string;
  originalPrice: number;
  proposedPrice: number;
  discountRequested: number;
  discountOffered: number;
  finalPrice?: number;
  status: 'negotiating' | 'accepted' | 'rejected' | 'counter_offer';
  notes: string;
  negotiationDate: string;
  employeeId: string;
  employeeName: string;
}

const NegotiationHistory = () => {
  const [negotiations, setNegotiations] = useState<NegotiationRecord[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<NegotiationRecord>>({
    status: 'negotiating',
    originalPrice: 0,
    proposedPrice: 0,
    discountRequested: 0,
    discountOffered: 0,
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadNegotiations();
    loadVehiclesAndCustomers();
  }, []);

  const loadNegotiations = () => {
    const savedNegotiations = localStorage.getItem('negotiations');
    if (savedNegotiations) {
      setNegotiations(JSON.parse(savedNegotiations));
    }
  };

  const loadVehiclesAndCustomers = () => {
    const savedVehicles = localStorage.getItem('vehicles');
    const savedCustomers = localStorage.getItem('customers');
    
    if (savedVehicles) setVehicles(JSON.parse(savedVehicles));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
  };

  const saveNegotiations = (updatedNegotiations: NegotiationRecord[]) => {
    localStorage.setItem('negotiations', JSON.stringify(updatedNegotiations));
    setNegotiations(updatedNegotiations);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleId || !formData.customerId || !formData.originalPrice) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
    const selectedCustomer = customers.find(c => c.id === formData.customerId);

    const newNegotiation: NegotiationRecord = {
      id: Date.now().toString(),
      vehicleId: formData.vehicleId!,
      vehicleInfo: `${selectedVehicle?.brand} ${selectedVehicle?.model} - ${selectedVehicle?.year}`,
      customerId: formData.customerId!,
      customerName: selectedCustomer?.name || '',
      originalPrice: Number(formData.originalPrice),
      proposedPrice: Number(formData.proposedPrice),
      discountRequested: Number(formData.discountRequested),
      discountOffered: Number(formData.discountOffered),
      finalPrice: formData.finalPrice ? Number(formData.finalPrice) : undefined,
      status: formData.status!,
      notes: formData.notes || '',
      negotiationDate: new Date().toISOString(),
      employeeId: 'admin',
      employeeName: 'Admin'
    };

    const updatedNegotiations = [...negotiations, newNegotiation];
    saveNegotiations(updatedNegotiations);
    resetForm();
    
    toast({
      title: "Negociação registrada",
      description: "O histórico de negociação foi registrado com sucesso.",
    });
  };

  const resetForm = () => {
    setFormData({
      status: 'negotiating',
      originalPrice: 0,
      proposedPrice: 0,
      discountRequested: 0,
      discountOffered: 0,
      notes: ''
    });
    setShowAddForm(false);
  };

  const updateNegotiationStatus = (negotiationId: string, status: string, finalPrice?: number) => {
    const updatedNegotiations = negotiations.map(negotiation => 
      negotiation.id === negotiationId 
        ? { ...negotiation, status: status as any, finalPrice }
        : negotiation
    );
    saveNegotiations(updatedNegotiations);
    
    toast({
      title: "Status atualizado",
      description: "O status da negociação foi atualizado.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'negotiating':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'counter_offer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'negotiating':
        return 'Negociando';
      case 'accepted':
        return 'Aceito';
      case 'rejected':
        return 'Rejeitado';
      case 'counter_offer':
        return 'Contra-proposta';
      default:
        return status;
    }
  };

  const calculateDiscountPercentage = (originalPrice: number, discountAmount: number) => {
    return originalPrice > 0 ? (discountAmount / originalPrice * 100).toFixed(1) : '0';
  };

  const getNegotiationStats = () => {
    const total = negotiations.length;
    const accepted = negotiations.filter(n => n.status === 'accepted').length;
    const avgDiscount = negotiations.length > 0 
      ? negotiations.reduce((sum, n) => sum + n.discountOffered, 0) / negotiations.length 
      : 0;
    const totalDiscountGiven = negotiations
      .filter(n => n.status === 'accepted')
      .reduce((sum, n) => sum + n.discountOffered, 0);
    
    return { total, accepted, avgDiscount, totalDiscountGiven };
  };

  const stats = getNegotiationStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Histórico de Negociações</h3>
          <p className="text-gray-600">Registro de descontos solicitados e oferecidos</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Negociação
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Negociações</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aceitas</p>
                <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Desconto Médio</p>
                <p className="text-2xl font-bold text-orange-600">
                  R$ {stats.avgDiscount.toLocaleString()}
                </p>
              </div>
              <Percent className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Descontado</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {stats.totalDiscountGiven.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Negociações */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Negociações</CardTitle>
        </CardHeader>
        <CardContent>
          {negotiations.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma negociação registrada.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Preço Original</TableHead>
                  <TableHead>Desconto Pedido</TableHead>
                  <TableHead>Desconto Oferecido</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {negotiations.map((negotiation) => (
                  <TableRow key={negotiation.id}>
                    <TableCell className="font-medium">{negotiation.customerName}</TableCell>
                    <TableCell>{negotiation.vehicleInfo}</TableCell>
                    <TableCell className="font-bold">
                      R$ {negotiation.originalPrice.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-red-600">
                          R$ {negotiation.discountRequested.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {calculateDiscountPercentage(negotiation.originalPrice, negotiation.discountRequested)}%
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-orange-600">
                          R$ {negotiation.discountOffered.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {calculateDiscountPercentage(negotiation.originalPrice, negotiation.discountOffered)}%
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(negotiation.status)}>
                        {getStatusLabel(negotiation.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(negotiation.negotiationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {negotiation.status === 'negotiating' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateNegotiationStatus(negotiation.id, 'accepted', negotiation.originalPrice - negotiation.discountOffered)}
                            >
                              Aceitar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateNegotiationStatus(negotiation.id, 'rejected')}
                            >
                              Rejeitar
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Nova Negociação */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Nova Negociação</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="customerId">Cliente</Label>
              <select
                className="w-full p-2 border rounded"
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
              >
                <option value="">Selecione o cliente</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="vehicleId">Veículo</Label>
              <select
                className="w-full p-2 border rounded"
                value={formData.vehicleId}
                onChange={(e) => {
                  const selectedVehicle = vehicles.find(v => v.id === e.target.value);
                  setFormData({
                    ...formData, 
                    vehicleId: e.target.value,
                    originalPrice: selectedVehicle?.price || 0
                  });
                }}
              >
                <option value="">Selecione o veículo</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.brand} {vehicle.model} - R$ {vehicle.price?.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="originalPrice">Preço Original</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({...formData, originalPrice: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="proposedPrice">Preço Proposto</Label>
                <Input
                  id="proposedPrice"
                  type="number"
                  step="0.01"
                  value={formData.proposedPrice}
                  onChange={(e) => {
                    const proposedPrice = parseFloat(e.target.value) || 0;
                    const discountRequested = (formData.originalPrice || 0) - proposedPrice;
                    setFormData({
                      ...formData, 
                      proposedPrice,
                      discountRequested: Math.max(0, discountRequested)
                    });
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountRequested">Desconto Pedido</Label>
                <Input
                  id="discountRequested"
                  type="number"
                  step="0.01"
                  value={formData.discountRequested}
                  onChange={(e) => setFormData({...formData, discountRequested: parseFloat(e.target.value) || 0})}
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="discountOffered">Desconto Oferecido</Label>
                <Input
                  id="discountOffered"
                  type="number"
                  step="0.01"
                  value={formData.discountOffered}
                  onChange={(e) => setFormData({...formData, discountOffered: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Detalhes da negociação, argumentos do cliente, etc."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button type="submit">
                Registrar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NegotiationHistory;
