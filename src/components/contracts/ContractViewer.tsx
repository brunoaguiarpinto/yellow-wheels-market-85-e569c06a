
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contract, ContractStatus } from "@/types/contracts";
import { Download, Edit, FileText } from "lucide-react";

interface ContractViewerProps {
  contract: Contract;
}

const ContractViewer = ({ contract }: ContractViewerProps) => {
  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT:
        return "bg-gray-100 text-gray-800";
      case ContractStatus.PENDING_SIGNATURE:
        return "bg-yellow-100 text-yellow-800";
      case ContractStatus.SIGNED:
        return "bg-green-100 text-green-800";
      case ContractStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.DRAFT:
        return "Rascunho";
      case ContractStatus.PENDING_SIGNATURE:
        return "Aguardando Assinatura";
      case ContractStatus.SIGNED:
        return "Assinado";
      case ContractStatus.CANCELLED:
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold">Contrato {contract.contractNumber}</h3>
          <Badge className={getStatusColor(contract.status)}>
            {getStatusLabel(contract.status)}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Nome:</strong> {contract.customerName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Veículo</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Veículo:</strong> {contract.vehicleBrand} {contract.vehicleModel}</p>
            <p><strong>Ano:</strong> {contract.vehicleYear}</p>
            <p><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(contract.salePrice)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cláusulas do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {contract.clauses.map((clause) => (
            <div key={clause.id} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">{clause.title}</h4>
              <p className="text-gray-700 mt-1">{clause.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {contract.observations && (
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{contract.observations}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informações do Contrato</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Data de Criação:</strong> {new Date(contract.createdAt).toLocaleDateString('pt-BR')}</p>
            <p><strong>Vendedor:</strong> {contract.employeeName}</p>
            {contract.signedAt && (
              <p><strong>Data de Assinatura:</strong> {new Date(contract.signedAt).toLocaleDateString('pt-BR')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractViewer;
