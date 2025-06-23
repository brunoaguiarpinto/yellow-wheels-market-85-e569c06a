import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Eye, Download } from "lucide-react";
import { Contract, ContractStatus, ContractType } from "@/types/contracts";
import { useToast } from "@/hooks/use-toast";
import ContractGenerator from "./ContractGenerator";
import ContractViewer from "./ContractViewer";

const ContractsModule = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const { data: contracts = [], isLoading } = useQuery<Contract[]>({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data } = await api.get('/contracts');
      return data;
    },
  });

  const createContractMutation = useMutation({
    mutationFn: (newContract: Contract) => api.post('/contracts', newContract),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({ title: "Contrato gerado", description: "O contrato foi gerado com sucesso." });
      setIsGeneratorOpen(false);
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível gerar o contrato.", variant: "destructive" });
    }
  });

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsViewerOpen(true);
  };

  const handleContractGenerated = (contract: Contract) => {
    createContractMutation.mutate(contract);
  };

  // ... (funções de getStatusColor, getStatusLabel, etc. permanecem as mesmas)
  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT: return "bg-gray-100 text-gray-800";
      case ContractStatus.PENDING_SIGNATURE: return "bg-yellow-100 text-yellow-800";
      case ContractStatus.SIGNED: return "bg-green-100 text-green-800";
      case ContractStatus.CANCELLED: return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  const getStatusLabel = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT: return "Rascunho";
      case ContractStatus.PENDING_SIGNATURE: return "Aguardando Assinatura";
      case ContractStatus.SIGNED: return "Assinado";
      case ContractStatus.CANCELLED: return "Cancelado";
      default: return status;
    }
  };
  const getContractTypeLabel = (type: ContractType) => {
    switch (type) {
      case ContractType.WARRANTY_TERM: return "Garantia";
      case ContractType.CONSIGNMENT: return "Consignação";
      case ContractType.SALE: return "Compra/Venda";
      default: return type;
    }
  };
  const getContractTypeColor = (type: ContractType) => {
    switch (type) {
      case ContractType.WARRANTY_TERM: return "bg-orange-100 text-orange-800";
      case ContractType.CONSIGNMENT: return "bg-blue-100 text-blue-800";
      case ContractType.SALE: return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContracts = contracts.filter(contract =>
    contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.vehicleBrand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Contratos e Documentos</h2>
          <p className="text-gray-600">Gerencie contratos de compra e venda, consignação e termos de garantia</p>
        </div>
        <Button onClick={() => setIsGeneratorOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Contrato</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por número, cliente ou veículo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Carregando...</p> : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Veículo</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.contractNumber}</TableCell>
                      <TableCell>
                        <Badge className={getContractTypeColor(contract.contractType)}>
                          {getContractTypeLabel(contract.contractType)}
                        </Badge>
                      </TableCell>
                      <TableCell>{contract.customerName}</TableCell>
                      <TableCell>
                        {contract.vehicleBrand} {contract.vehicleModel} {contract.vehicleYear}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.salePrice)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(contract.status)}>
                          {getStatusLabel(contract.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewContract(contract)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerar Novo Contrato</DialogTitle>
          </DialogHeader>
          <ContractGenerator
            onContractGenerated={handleContractGenerated}
            onCancel={() => setIsGeneratorOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualizar Contrato</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <ContractViewer contract={selectedContract} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractsModule;
