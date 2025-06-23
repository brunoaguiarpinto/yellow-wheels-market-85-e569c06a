import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Building, Calendar, AlertCircle } from "lucide-react";
import { FixedCost } from "@/types/financial-advanced";
import { useToast } from "@/hooks/use-toast";

const FixedCostsManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCost, setEditingCost] = useState<FixedCost | null>(null);

  const { data: fixedCosts = [], isLoading } = useQuery<FixedCost[]>({
    queryKey: ['fixedCosts'],
    queryFn: async () => {
      const { data } = await api.get('/fixed-costs');
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: (costData: Partial<FixedCost>) => {
      if (editingCost) {
        return api.put(`/fixed-costs/${editingCost.id}`, costData);
      }
      return api.post('/fixed-costs', costData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedCosts'] });
      toast({
        title: editingCost ? "Custo atualizado" : "Custo adicionado",
        description: "O custo fixo foi salvo com sucesso.",
      });
      setIsDialogOpen(false);
      setEditingCost(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o custo fixo.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (costId: string) => api.delete(`/fixed-costs/${costId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixedCosts'] });
      toast({ title: "Custo removido", description: "O custo fixo foi removido." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível remover o custo.", variant: "destructive" });
    }
  });

  const handleNewCost = () => {
    setEditingCost(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (cost: FixedCost) => {
    setEditingCost(cost);
    setIsDialogOpen(true);
  };

  const handleDelete = (costId: string) => {
    deleteMutation.mutate(costId);
  };

  const handleSubmit = (formData: Partial<FixedCost>) => {
    mutation.mutate(formData);
  };

  const getMonthlyTotal = () => {
    return fixedCosts.reduce((sum, cost) => {
      switch (cost.frequency) {
        case 'monthly': return sum + cost.amount;
        case 'quarterly': return sum + (cost.amount / 3);
        case 'yearly': return sum + (cost.amount / 12);
        default: return sum;
      }
    }, 0);
  };

  // ... (funções de getStatusColor, getStatusLabel, getFrequencyLabel permanecem as mesmas)
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'overdue': return 'Vencido';
      default: return 'Pendente';
    }
  };
  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 'Mensal';
      case 'quarterly': return 'Trimestral';
      case 'yearly': return 'Anual';
      default: return 'Único';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Custos Fixos</h3>
          <p className="text-gray-600">Gestão de custos operacionais e administrativos</p>
        </div>
        <Button onClick={handleNewCost}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Custo Fixo
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ... (cards de resumo) */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Custos Fixos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Carregando...</p> : (
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
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(cost)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cost.id)}>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCost ? 'Editar Custo Fixo' : 'Novo Custo Fixo'}
            </DialogTitle>
          </DialogHeader>
          <CostForm 
            onSubmit={handleSubmit} 
            initialData={editingCost} 
            onCancel={() => { setIsDialogOpen(false); setEditingCost(null); }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente de formulário separado para reutilização
const CostForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    category: initialData?.category || '',
    description: initialData?.description || '',
    amount: initialData?.amount || 0,
    frequency: initialData?.frequency || 'monthly',
    dueDate: initialData?.dueDate ? initialData.dueDate.split('T')[0] : '',
    isRecurring: initialData?.isRecurring ?? true,
    status: initialData?.status || 'pending'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... (campos do formulário) */}
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
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};

export default FixedCostsManager;
