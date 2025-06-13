
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { VehicleCost, CostType } from "@/types/financial-advanced";
import { useToast } from "@/hooks/use-toast";

interface VehicleCostManagerProps {
  vehicleId: string;
  vehicleName: string;
  onCostUpdate?: () => void;
}

const VehicleCostManager = ({ vehicleId, vehicleName, onCostUpdate }: VehicleCostManagerProps) => {
  const [costs, setCosts] = useState<VehicleCost[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCost, setEditingCost] = useState<VehicleCost | null>(null);
  const [formData, setFormData] = useState<Partial<VehicleCost>>({
    type: CostType.MAINTENANCE,
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadVehicleCosts();
  }, [vehicleId]);

  const loadVehicleCosts = () => {
    const savedCosts = localStorage.getItem('vehicleCosts');
    if (savedCosts) {
      const allCosts: VehicleCost[] = JSON.parse(savedCosts);
      setCosts(allCosts.filter(cost => cost.vehicleId === vehicleId));
    }
  };

  const saveCosts = (updatedCosts: VehicleCost[]) => {
    const savedCosts = localStorage.getItem('vehicleCosts');
    const allCosts: VehicleCost[] = savedCosts ? JSON.parse(savedCosts) : [];
    const otherCosts = allCosts.filter(cost => cost.vehicleId !== vehicleId);
    const newAllCosts = [...otherCosts, ...updatedCosts];
    localStorage.setItem('vehicleCosts', JSON.stringify(newAllCosts));
    setCosts(updatedCosts);
    onCostUpdate?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description || !formData.amount) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newCost: VehicleCost = {
      id: editingCost?.id || Date.now().toString(),
      vehicleId,
      type: formData.type!,
      category: formData.category,
      description: formData.description,
      amount: Number(formData.amount),
      date: formData.date!,
      supplier: formData.supplier,
      notes: formData.notes,
      createdBy: 'Admin',
      createdAt: editingCost?.createdAt || new Date().toISOString()
    };

    let updatedCosts;
    if (editingCost) {
      updatedCosts = costs.map(cost => cost.id === editingCost.id ? newCost : cost);
      toast({
        title: "Custo atualizado",
        description: "O custo foi atualizado com sucesso.",
      });
    } else {
      updatedCosts = [...costs, newCost];
      toast({
        title: "Custo adicionado",
        description: "Novo custo foi registrado para o veículo.",
      });
    }

    saveCosts(updatedCosts);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: CostType.MAINTENANCE,
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      supplier: '',
      notes: ''
    });
    setEditingCost(null);
    setShowAddForm(false);
  };

  const handleEdit = (cost: VehicleCost) => {
    setFormData(cost);
    setEditingCost(cost);
    setShowAddForm(true);
  };

  const handleDelete = (costId: string) => {
    const updatedCosts = costs.filter(cost => cost.id !== costId);
    saveCosts(updatedCosts);
    toast({
      title: "Custo removido",
      description: "O custo foi removido com sucesso.",
    });
  };

  const getTotalCosts = () => costs.reduce((sum, cost) => sum + cost.amount, 0);
  
  const getCostsByType = () => {
    const costsByType: { [key: string]: number } = {};
    costs.forEach(cost => {
      costsByType[cost.type] = (costsByType[cost.type] || 0) + cost.amount;
    });
    return costsByType;
  };

  const getCostTypeLabel = (type: CostType) => {
    const labels = {
      [CostType.PURCHASE]: 'Compra',
      [CostType.MAINTENANCE]: 'Manutenção',
      [CostType.DOCUMENTATION]: 'Documentação',
      [CostType.TRANSPORT]: 'Transporte',
      [CostType.MARKETING]: 'Marketing',
      [CostType.OTHER]: 'Outros'
    };
    return labels[type];
  };

  const getCostTypeColor = (type: CostType) => {
    const colors = {
      [CostType.PURCHASE]: 'bg-blue-100 text-blue-800',
      [CostType.MAINTENANCE]: 'bg-orange-100 text-orange-800',
      [CostType.DOCUMENTATION]: 'bg-green-100 text-green-800',
      [CostType.TRANSPORT]: 'bg-purple-100 text-purple-800',
      [CostType.MARKETING]: 'bg-pink-100 text-pink-800',
      [CostType.OTHER]: 'bg-gray-100 text-gray-800'
    };
    return colors[type];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Custos - {vehicleName}</h3>
          <p className="text-gray-600">Gestão detalhada de custos do veículo</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Custo
        </Button>
      </div>

      {/* Resumo de Custos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Custos</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {getTotalCosts().toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Itens de Custo</p>
                <p className="text-2xl font-bold text-blue-600">
                  {costs.length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custo Médio</p>
                <p className="text-2xl font-bold text-purple-600">
                  R$ {costs.length > 0 ? (getTotalCosts() / costs.length).toFixed(0) : '0'}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Custos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Custos</CardTitle>
        </CardHeader>
        <CardContent>
          {costs.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum custo registrado para este veículo.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {costs.map((cost) => (
                  <TableRow key={cost.id}>
                    <TableCell>
                      {new Date(cost.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getCostTypeColor(cost.type)}>
                        {getCostTypeLabel(cost.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{cost.category}</TableCell>
                    <TableCell>{cost.description}</TableCell>
                    <TableCell className="font-bold text-red-600">
                      R$ {cost.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{cost.supplier || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(cost)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(cost.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Adicionar/Editar Custo */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCost ? 'Editar Custo' : 'Novo Custo'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Tipo de Custo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({...formData, type: value as CostType})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CostType.PURCHASE}>Compra</SelectItem>
                  <SelectItem value={CostType.MAINTENANCE}>Manutenção</SelectItem>
                  <SelectItem value={CostType.DOCUMENTATION}>Documentação</SelectItem>
                  <SelectItem value={CostType.TRANSPORT}>Transporte</SelectItem>
                  <SelectItem value={CostType.MARKETING}>Marketing</SelectItem>
                  <SelectItem value={CostType.OTHER}>Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Ex: Troca de óleo, IPVA, etc."
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrição detalhada do custo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                placeholder="Nome do fornecedor (opcional)"
              />
            </div>

            <div>
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observações adicionais (opcional)"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingCost ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleCostManager;
