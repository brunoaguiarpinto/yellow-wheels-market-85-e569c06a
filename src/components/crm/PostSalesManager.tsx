
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
import { Plus, AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react";
import { PostSaleIssue, IssueStatus, IssuePriority } from "@/types/post-sales";
import { useToast } from "@/hooks/use-toast";

const PostSalesManager = () => {
  const [issues, setIssues] = useState<PostSaleIssue[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<PostSaleIssue>>({
    priority: IssuePriority.MEDIUM,
    status: IssueStatus.OPEN,
    description: '',
    resolution: '',
    estimatedCost: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadIssues();
    loadVehiclesAndCustomers();
  }, []);

  const loadIssues = () => {
    const savedIssues = localStorage.getItem('postSaleIssues');
    if (savedIssues) {
      setIssues(JSON.parse(savedIssues));
    }
  };

  const loadVehiclesAndCustomers = () => {
    const savedVehicles = localStorage.getItem('vehicles');
    const savedCustomers = localStorage.getItem('customers');
    const savedSales = localStorage.getItem('sales');
    
    if (savedVehicles) setVehicles(JSON.parse(savedVehicles));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
  };

  const saveIssues = (updatedIssues: PostSaleIssue[]) => {
    localStorage.setItem('postSaleIssues', JSON.stringify(updatedIssues));
    setIssues(updatedIssues);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.vehicleId || !formData.customerId || !formData.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newIssue: PostSaleIssue = {
      id: Date.now().toString(),
      vehicleId: formData.vehicleId!,
      customerId: formData.customerId!,
      customerName: customers.find(c => c.id === formData.customerId)?.name || '',
      vehicleInfo: vehicles.find(v => v.id === formData.vehicleId)?.brand + ' ' + 
                   vehicles.find(v => v.id === formData.vehicleId)?.model || '',
      issueType: formData.issueType!,
      description: formData.description,
      priority: formData.priority!,
      status: formData.status!,
      reportDate: new Date().toISOString(),
      resolution: formData.resolution,
      estimatedCost: Number(formData.estimatedCost) || 0,
      actualCost: formData.actualCost ? Number(formData.actualCost) : undefined,
      assignedTo: 'Admin',
      createdAt: new Date().toISOString()
    };

    const updatedIssues = [...issues, newIssue];
    saveIssues(updatedIssues);
    resetForm();
    
    toast({
      title: "Problema registrado",
      description: "O problema pós-venda foi registrado com sucesso.",
    });
  };

  const resetForm = () => {
    setFormData({
      priority: IssuePriority.MEDIUM,
      status: IssueStatus.OPEN,
      description: '',
      resolution: '',
      estimatedCost: 0
    });
    setShowAddForm(false);
  };

  const updateIssueStatus = (issueId: string, status: IssueStatus) => {
    const updatedIssues = issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, status, resolvedDate: status === IssueStatus.RESOLVED ? new Date().toISOString() : undefined }
        : issue
    );
    saveIssues(updatedIssues);
    
    toast({
      title: "Status atualizado",
      description: "O status do problema foi atualizado.",
    });
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return 'bg-red-100 text-red-800';
      case IssueStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case IssueStatus.RESOLVED:
        return 'bg-green-100 text-green-800';
      case IssueStatus.CLOSED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: IssueStatus) => {
    switch (status) {
      case IssueStatus.OPEN:
        return 'Aberto';
      case IssueStatus.IN_PROGRESS:
        return 'Em Andamento';
      case IssueStatus.RESOLVED:
        return 'Resolvido';
      case IssueStatus.CLOSED:
        return 'Fechado';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case IssuePriority.LOW:
        return 'bg-blue-100 text-blue-800';
      case IssuePriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case IssuePriority.HIGH:
        return 'bg-orange-100 text-orange-800';
      case IssuePriority.URGENT:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: IssuePriority) => {
    switch (priority) {
      case IssuePriority.LOW:
        return 'Baixa';
      case IssuePriority.MEDIUM:
        return 'Média';
      case IssuePriority.HIGH:
        return 'Alta';
      case IssuePriority.URGENT:
        return 'Urgente';
      default:
        return priority;
    }
  };

  const getIssueStats = () => {
    const total = issues.length;
    const open = issues.filter(i => i.status === IssueStatus.OPEN).length;
    const resolved = issues.filter(i => i.status === IssueStatus.RESOLVED).length;
    const totalCost = issues.reduce((sum, issue) => sum + (issue.actualCost || issue.estimatedCost || 0), 0);
    
    return { total, open, resolved, totalCost };
  };

  const stats = getIssueStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Pós-Venda</h3>
          <p className="text-gray-600">Gestão de problemas e suporte pós-venda</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar Problema
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Casos</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Casos Abertos</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custo Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  R$ {stats.totalCost.toLocaleString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Problemas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Problemas Pós-Venda</CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum problema pós-venda registrado.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Problema</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">{issue.customerName}</TableCell>
                    <TableCell>{issue.vehicleInfo}</TableCell>
                    <TableCell className="max-w-xs truncate">{issue.description}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(issue.priority)}>
                        {getPriorityLabel(issue.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(issue.status)}>
                        {getStatusLabel(issue.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(issue.reportDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-bold text-red-600">
                      R$ {(issue.actualCost || issue.estimatedCost || 0).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {issue.status === IssueStatus.OPEN && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateIssueStatus(issue.id, IssueStatus.IN_PROGRESS)}
                          >
                            Iniciar
                          </Button>
                        )}
                        {issue.status === IssueStatus.IN_PROGRESS && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateIssueStatus(issue.id, IssueStatus.RESOLVED)}
                          >
                            Resolver
                          </Button>
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

      {/* Dialog de Novo Problema */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registrar Problema Pós-Venda</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="customerId">Cliente</Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) => setFormData({...formData, customerId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
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
              <Label htmlFor="vehicleId">Veículo</Label>
              <Select
                value={formData.vehicleId}
                onValueChange={(value) => setFormData({...formData, vehicleId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o veículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} - {vehicle.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="issueType">Tipo de Problema</Label>
              <Input
                id="issueType"
                value={formData.issueType}
                onChange={(e) => setFormData({...formData, issueType: e.target.value})}
                placeholder="Ex: Câmbio, Motor, Elétrico"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição do Problema</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva detalhadamente o problema relatado"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({...formData, priority: value as IssuePriority})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={IssuePriority.LOW}>Baixa</SelectItem>
                    <SelectItem value={IssuePriority.MEDIUM}>Média</SelectItem>
                    <SelectItem value={IssuePriority.HIGH}>Alta</SelectItem>
                    <SelectItem value={IssuePriority.URGENT}>Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="estimatedCost">Custo Estimado</Label>
                <Input
                  id="estimatedCost"
                  type="number"
                  step="0.01"
                  value={formData.estimatedCost}
                  onChange={(e) => setFormData({...formData, estimatedCost: parseFloat(e.target.value) || 0})}
                />
              </div>
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

export default PostSalesManager;
