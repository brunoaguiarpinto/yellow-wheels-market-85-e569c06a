
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Calendar } from "lucide-react";
import { useSupabaseData, useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from "@/hooks/useSupabaseData";
import FixedCostForm from "./FixedCostForm";

const FixedCostManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCostForm, setShowCostForm] = useState(false);
  const [selectedCost, setSelectedCost] = useState<any>(null);

  const { data: fixedCosts, loading, refetch } = useSupabaseData('fixed_costs');
  const { insert: insertCost } = useSupabaseInsert('fixed_costs');
  const { update: updateCost } = useSupabaseUpdate('fixed_costs');
  const { deleteRecord: deleteCost } = useSupabaseDelete('fixed_costs');

  const filteredCosts = fixedCosts.filter((cost: any) =>
    cost.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cost.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCostSubmit = async (data: any) => {
    if (selectedCost) {
      await updateCost(selectedCost.id, data);
    } else {
      await insertCost(data);
    }
    setShowCostForm(false);
    setSelectedCost(null);
    refetch();
  };

  const handleEditCost = (cost: any) => {
    setSelectedCost(cost);
    setShowCostForm(true);
  };

  const handleDeleteCost = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este custo fixo?')) {
      await deleteCost(id);
      refetch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 'Mensal';
      case 'yearly': return 'Anual';
      case 'weekly': return 'Semanal';
      case 'quarterly': return 'Trimestral';
      default: return frequency;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Gestão de Custos Fixos</h3>
          <p className="text-gray-600">Controle de despesas fixas da empresa</p>
        </div>
        <Button onClick={() => setShowCostForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Custo Fixo</span>
        </Button>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por categoria ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600">Total Mensal</p>
            <p className="text-xl font-bold text-red-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                filteredCosts
                  .filter((cost: any) => cost.frequency === 'monthly')
                  .reduce((sum: number, cost: any) => sum + (Number(cost.amount) || 0), 0)
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {filteredCosts.filter((cost: any) => cost.status === 'pending').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600">Em Atraso</p>
            <p className="text-2xl font-bold text-red-600">
              {filteredCosts.filter((cost: any) => cost.status === 'overdue').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600">Pagos</p>
            <p className="text-2xl font-bold text-green-600">
              {filteredCosts.filter((cost: any) => cost.status === 'paid').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Custos Fixos */}
      <Card>
        <CardHeader>
          <CardTitle>Custos Fixos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recorrente</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCosts.map((cost: any) => (
                  <TableRow key={cost.id}>
                    <TableCell className="font-medium">{cost.category}</TableCell>
                    <TableCell>{cost.description}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cost.amount)}
                    </TableCell>
                    <TableCell>{getFrequencyLabel(cost.frequency)}</TableCell>
                    <TableCell>
                      {cost.due_date ? (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{new Date(cost.due_date).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(cost.status)}>
                        {cost.status === 'pending' ? 'Pendente' : 
                         cost.status === 'paid' ? 'Pago' : 
                         cost.status === 'overdue' ? 'Atrasado' : cost.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={cost.is_recurring ? 'default' : 'outline'}>
                        {cost.is_recurring ? 'Sim' : 'Não'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCost(cost)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCost(cost.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredCosts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum custo fixo encontrado.' : 'Nenhum custo fixo cadastrado ainda.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showCostForm && (
        <FixedCostForm
          initialData={selectedCost}
          onSubmit={handleCostSubmit}
          onCancel={() => {
            setShowCostForm(false);
            setSelectedCost(null);
          }}
        />
      )}
    </div>
  );
};

export default FixedCostManager;
