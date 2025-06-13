
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Building, Calendar, AlertCircle } from "lucide-react";
import { FixedCost } from "@/types/financial-advanced";
import { useToast } from "@/hooks/use-toast";

const FixedCostsManager = () => {
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCost, setEditingCost] = useState<FixedCost | null>(null);
  const [formData, setFormData] = useState<Partial<FixedCost>>({
    category: '',
    description: '',
    amount: 0,
    frequency: 'monthly',
    isRecurring: true,
    status: 'pending'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadFixedCosts();
  }, []);

  const loadFixedCosts = () => {
    const savedCosts = localStorage.getItem('fixedCosts');
    if (savedCosts) {
      setFixedCosts(JSON.parse(savedCosts));
    }
  };

  const saveFixedCosts = (costs: FixedCost[]) => {
    localStorage.setItem('fixedCosts', JSON.stringify(costs));
    setFixedCosts(costs);
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

    const newCost: FixedCost = {
      id: editingCost?.id || Date.now().toString(),
      category: formData.category,
      description: formData.description,
      amount: Number(formData.amount),
      frequency: formData.frequency!,
      dueDate: formData.dueDate,
      isRecurring: formData.isRecurring!,
      status: formData.status!,
      createdAt: editingCost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedCosts;
    if (editingCost) {
      updatedCosts = fixedCosts.map(cost => cost.id === editingCost.id ? newCost : cost);
      toast({
        title: "Custo fixo atualizado",
        description: "O custo fixo foi atualizado com sucesso.",
      });
    } else {
      updatedCosts = [...fixedCosts, newCost];
      toast({
        title: "Custo fixo adicionado",
        description: "Novo custo fixo foi registrado.",
      });
    }

    saveFixedCosts(updatedCosts);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      category: '',
      description: '',
      amount: 0,
      frequency: 'monthly',
      isRecurring: true,
      status: 'pending'
    });
    setEditingCost(null);
    setShowAddForm(false);
  };

  const handleEdit = (cost: FixedCost) => {
    setFormData(cost);
    setEditingCost(cost);
    setShowAddForm(true);
  };

  const handleDelete = (costId: string) => {
    const updatedCosts = fixedCosts.filter(cost => cost.id !== costId);
    saveFixedCosts(updatedCosts);
    toast({
      title: "Custo fixo removido",
      description: "O custo fixo foi removido com sucesso.",
    });
  };

  const getMonthlyTotal = () => {
    return fixedCosts.reduce((sum, cost) => {
      switch (cost.frequency) {
        case 'monthly':
          return sum + cost.amount;
        case 'quarterly':
          return sum + (cost.amount / 3);
        case 'yearly':
          return sum + (cost.amount / 12);
        default:
          return sum;
      }
    }, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'overdue':
        return 'Vencido';
      default:
        return 'Pendente';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'monthly':
        return 'Mensal';
      case 'quarterly':
        return 'Trimestral';
      case 'yearly':
        return 'Anual';
      default:
        return 'Único';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Custos Fixos</h3>
          <p className="text-gray-600">Gestão de custos operacionais e administrativos</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Custo Fixo
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custo Mensal</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {getMonthlyTotal().toLocaleString()}
                </p>
              </div>
              <Building className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Custos</p>
                <p className="text-2xl font-bold text-blue-600">
                  {fixedCosts.length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">
                  {fixedCosts.filter(cost => cost.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Custos Fixos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Custos Fixos</CardTitle>
        </CardHeader>
        <CardContent>
          {fixedCosts.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum custo fixo registrado.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fixedCosts.map((cost) => (
                  <TableRow key={cost.id}>
                    <TableCell className="font-medium">{cost.category}</TableCell>
                    <TableCell>{cost.description}</TableCell>
                    <TableCell className="font-bold text-red-600">
                      R$ {cost.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getFrequencyLabel(cost.frequency)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(cost.status)}>
                        {getStatusLabel(cost.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {cost.dueDate ? new Date(cost.dueDate).toLocaleDateString() : '-'}
                    </TableCell>
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

      {/* Dialog de Adicionar/Editar Custo Fixo */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCost ? 'Editar Custo Fixo' : 'Novo Custo Fixo'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="Ex: Aluguel, Energia, Internet"
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
                <Label htmlFor="frequency">Frequência</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({...formData, frequency: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                    <SelectItem value="yearly">Anual</SelectItem>
                    <SelectItem value="one-time">Único</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Data de Vencimento</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="paid">Pago</SelectItem>
                    <SelectItem value="overdue">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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

export default FixedCostsManager;
