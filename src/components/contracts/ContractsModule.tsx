
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Eye, Download } from "lucide-react";
import { ContractStatus, ContractType } from "@/types/contracts";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import ContractGenerator from "./ContractGenerator";
import ContractViewer from "./ContractViewer";

const ContractsModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any | null>(null);
  const { toast } = useToast();

  const { data: contracts, loading, refetch } = useSupabaseData('contracts', `
    *,
    customers(name, document),
    vehicles(brand, model, year),
    employees(name)
  `);

  const handleNewContract = () => {
    setIsGeneratorOpen(true);
  };

  const handleViewContract = (contract: any) => {
    setSelectedContract(contract);
    setIsViewerOpen(true);
  };

  const handleContractGenerated = () => {
    setIsGeneratorOpen(false);
    refetch();
    
    toast({
      title: "Contrato gerado",
      description: "O contrato foi gerado com sucesso.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return "bg-gray-100 text-gray-800";
      case 'pending_signature':
        return "bg-yellow-100 text-yellow-800";
      case 'signed':
        return "bg-green-100 text-green-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return "Rascunho";
      case 'pending_signature':
        return "Aguardando Assinatura";
      case 'signed':
        return "Assinado";
      case 'cancelled':
        return "Cancelado";
      default:
        return status;
    }
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'warranty_term':
        return "Garantia";
      case 'consignment':
        return "Consignação";
      case 'sale':
        return "Compra/Venda";
      default:
        return type;
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'warranty_term':
        return "bg-orange-100 text-orange-800";
      case 'consignment':
        return "bg-blue-100 text-blue-800";
      case 'sale':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContracts = contracts.filter(contract =>
    contract.contract_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.customers?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.vehicles?.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando contratos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Contratos e Documentos</h2>
          <p className="text-gray-600">Gerencie contratos de compra e venda, consignação e termos de garantia</p>
        </div>
        <Button onClick={handleNewContract} className="flex items-center space-x-2">
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
                    <TableCell className="font-medium">{contract.contract_number}</TableCell>
                    <TableCell>
                      <Badge className={getContractTypeColor(contract.contract_type)}>
                        {getContractTypeLabel(contract.contract_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{contract.customers?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {contract.vehicles ? `${contract.vehicles.brand} ${contract.vehicles.model} ${contract.vehicles.year}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(contract.sale_price)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contract.status)}>
                        {getStatusLabel(contract.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(contract.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewContract(contract)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredContracts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-gray-500">
                        {searchTerm ? 'Nenhum contrato encontrado com os critérios de busca.' : 'Nenhum contrato cadastrado ainda.'}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
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
