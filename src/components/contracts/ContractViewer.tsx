
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Contract, ContractStatus, ContractType } from "@/types/contracts";
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

  const getContractTypeLabel = (type: ContractType) => {
    switch (type) {
      case ContractType.WARRANTY_TERM:
        return "Termo de Garantia e Isenção";
      case ContractType.CONSIGNMENT:
        return "Contrato de Consignação";
      case ContractType.SALE:
        return "Contrato de Compra e Venda";
      default:
        return type;
    }
  };

  const getContractTypeColor = (type: ContractType) => {
    switch (type) {
      case ContractType.WARRANTY_TERM:
        return "bg-orange-100 text-orange-800";
      case ContractType.CONSIGNMENT:
        return "bg-blue-100 text-blue-800";
      case ContractType.SALE:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Contrato {contract.contractNumber}</h3>
          <div className="flex space-x-2">
            <Badge className={getContractTypeColor(contract.contractType)}>
              {getContractTypeLabel(contract.contractType)}
            </Badge>
            <Badge className={getStatusColor(contract.status)}>
              {getStatusLabel(contract.status)}
            </Badge>
          </div>
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
          <CardContent className="space-y-2">
            <p><strong>Nome:</strong> {contract.customerName}</p>
            <p><strong>CPF:</strong> {contract.customerDocument}</p>
            <p><strong>Endereço:</strong> {contract.customerAddress}</p>
            {contract.customerPhone && (
              <p><strong>Telefone:</strong> {contract.customerPhone}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Veículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Veículo:</strong> {contract.vehicleBrand} {contract.vehicleModel}</p>
            <p><strong>Ano:</strong> {contract.vehicleYear}</p>
            <p><strong>Cor:</strong> {contract.vehicleColor}</p>
            <p><strong>Combustível:</strong> {contract.vehicleFuel}</p>
            {contract.vehiclePlate && (
              <p><strong>Placa:</strong> {contract.vehiclePlate}</p>
            )}
            <p><strong>Quilometragem:</strong> {contract.vehicleKm.toLocaleString('pt-BR')} km</p>
            <p><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(contract.salePrice)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Campos específicos por tipo de contrato */}
      {contract.contractType === ContractType.WARRANTY_TERM && (
        <Card>
          <CardHeader>
            <CardTitle>Informações da Garantia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contract.warrantyAmount && (
              <p><strong>Valor da Garantia:</strong> {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(contract.warrantyAmount)}</p>
            )}
            {contract.warrantyIssue && (
              <p><strong>Problema Relatado:</strong> {contract.warrantyIssue}</p>
            )}
          </CardContent>
        </Card>
      )}

      {contract.contractType === ContractType.CONSIGNMENT && (
        <Card>
          <CardHeader>
            <CardTitle>Informações da Consignação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {contract.consignmentDays && (
              <p><strong>Prazo:</strong> {contract.consignmentDays} dias</p>
            )}
            {contract.commissionRate && (
              <p><strong>Taxa de Comissão:</strong> {contract.commissionRate}%</p>
            )}
          </CardContent>
        </Card>
      )}

      {contract.contractType === ContractType.SALE && contract.tradeInVehicle && (
        <Card>
          <CardHeader>
            <CardTitle>Veículo de Troca</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Veículo:</strong> {contract.tradeInVehicle.brand} {contract.tradeInVehicle.model}</p>
            <p><strong>Ano:</strong> {contract.tradeInVehicle.year}</p>
            <p><strong>Cor:</strong> {contract.tradeInVehicle.color}</p>
            <p><strong>Placa:</strong> {contract.tradeInVehicle.plate}</p>
            <p><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(contract.tradeInVehicle.value)}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Cláusulas do Contrato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {contract.clauses.map((clause) => (
            <div key={clause.id} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-lg mb-2">
                CLÁUSULA {clause.order}ª - {clause.title}
              </h4>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {clause.content}
              </div>
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
            <p className="text-gray-700 whitespace-pre-wrap">{contract.observations}</p>
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

      {/* Assinaturas */}
      <Card>
        <CardHeader>
          <CardTitle>Assinaturas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <p className="mb-4">Campo Grande/MS, {new Date(contract.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center space-y-4">
              <div className="border-t border-gray-400 pt-2">
                <p className="font-semibold">{contract.customerName}</p>
                <p className="text-sm text-gray-600">CPF: {contract.customerDocument}</p>
                <p className="text-sm text-gray-600">
                  {contract.contractType === ContractType.CONSIGNMENT ? 'CONSIGNANTE/PROPRIETÁRIO' : 
                   contract.contractType === ContractType.WARRANTY_TERM ? 'CLIENTE' : 'COMPRADOR'}
                </p>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="border-t border-gray-400 pt-2">
                <p className="font-semibold">LORD MOTORS</p>
                <p className="text-sm text-gray-600">CNPJ: 48.234.972/0001-77</p>
                <p className="text-sm text-gray-600">
                  {contract.contractType === ContractType.CONSIGNMENT ? 'CONSIGNATÁRIA' : 'VENDEDORA'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2">
                <p className="text-sm text-gray-600">Testemunha 1</p>
                <p className="text-sm text-gray-600">Nome: ________________________</p>
                <p className="text-sm text-gray-600">RG/CPF: ____________________</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="border-t border-gray-400 pt-2">
                <p className="text-sm text-gray-600">Testemunha 2</p>
                <p className="text-sm text-gray-600">Nome: ________________________</p>
                <p className="text-sm text-gray-600">RG/CPF: ____________________</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractViewer;
