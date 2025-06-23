
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { VehicleStatus } from "@/types/vehicle";
import { Car, AlertCircle, Clock, CheckCircle, Wrench } from "lucide-react";

interface VehicleStatusManagerProps {
  vehicles: any[];
  onStatusUpdate?: () => void;
}

const VehicleStatusManager = ({ vehicles, onStatusUpdate }: VehicleStatusManagerProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const getStatusIcon = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case VehicleStatus.RESERVED:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case VehicleStatus.SOLD:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case VehicleStatus.MAINTENANCE:
        return <Wrench className="h-4 w-4 text-orange-500" />;
      case VehicleStatus.PURCHASED:
        return <Car className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return "bg-green-100 text-green-800";
      case VehicleStatus.RESERVED:
        return "bg-yellow-100 text-yellow-800";
      case VehicleStatus.SOLD:
        return "bg-blue-100 text-blue-800";
      case VehicleStatus.MAINTENANCE:
        return "bg-orange-100 text-orange-800";
      case VehicleStatus.PURCHASED:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.AVAILABLE:
        return "Disponível";
      case VehicleStatus.RESERVED:
        return "Reservado";
      case VehicleStatus.SOLD:
        return "Vendido";
      case VehicleStatus.MAINTENANCE:
        return "Manutenção";
      case VehicleStatus.PURCHASED:
        return "Comprado";
      default:
        return "Indefinido";
    }
  };

  const updateVehicleStatus = (vehicleId: string, newStatus: VehicleStatus, currentStatus: VehicleStatus) => {
    const storedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]');
    const updatedVehicles = storedVehicles.map((vehicle: any) => {
      if (vehicle.id === vehicleId) {
        return {
          ...vehicle,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return vehicle;
    });
    
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));

    // Registrar no histórico
    const history = JSON.parse(localStorage.getItem('vehicleHistory') || '[]');
    history.push({
      id: Date.now().toString(),
      vehicleId,
      action: 'status_changed',
      previousStatus: currentStatus,
      newStatus,
      details: `Status alterado de ${getStatusLabel(currentStatus)} para ${getStatusLabel(newStatus)}`,
      employeeId: user?.id || '',
      employeeName: user?.name || '',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('vehicleHistory', JSON.stringify(history));

    toast({
      title: "Status atualizado!",
      description: `Status do veículo alterado para ${getStatusLabel(newStatus)}.`,
    });

    onStatusUpdate?.();
  };

  const getDaysInStock = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getOldInventoryVehicles = () => {
    return vehicles.filter(vehicle => 
      vehicle.status === VehicleStatus.AVAILABLE && 
      getDaysInStock(vehicle.createdAt) > 60
    );
  };

  const statusCounts = vehicles.reduce((acc, vehicle) => {
    acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
    return acc;
  }, {} as Record<VehicleStatus, number>);

  return (
    <div className="space-y-6">
      {/* Resumo do Status */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Resumo do Estoque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {Object.values(VehicleStatus).map((status) => (
              <div key={status} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {getStatusIcon(status)}
                </div>
                <div className="text-2xl font-bold">{statusCounts[status] || 0}</div>
                <div className="text-sm text-gray-600">{getStatusLabel(status)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      {getOldInventoryVehicles().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-5 w-5" />
              Alertas de Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Veículos disponíveis há mais de 60 dias ({getOldInventoryVehicles().length} veículos)
            </p>
            <div className="space-y-2">
              {getOldInventoryVehicles().slice(0, 5).map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="font-opensans text-sm">
                    {vehicle.brand} {vehicle.model} - {vehicle.year}
                  </span>
                  <span className="text-xs text-orange-600">
                    {getDaysInStock(vehicle.createdAt)} dias
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gerenciador de Status */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Gerenciar Status dos Veículos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vehicles
              .filter(v => v.status !== VehicleStatus.SOLD)
              .map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-opensans font-semibold">
                      {vehicle.brand} {vehicle.model} - {vehicle.year}
                    </h4>
                    <p className="text-sm text-gray-600">
                      R$ {vehicle.price?.toLocaleString()} • {getDaysInStock(vehicle.createdAt)} dias no estoque
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge className={getStatusColor(vehicle.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(vehicle.status)}
                      {getStatusLabel(vehicle.status)}
                    </div>
                  </Badge>
                  
                  <Select
                    value={vehicle.status}
                    onValueChange={(newStatus: VehicleStatus) => 
                      updateVehicleStatus(vehicle.id, newStatus, vehicle.status)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VehicleStatus.AVAILABLE}>Disponível</SelectItem>
                      <SelectItem value={VehicleStatus.RESERVED}>Reservado</SelectItem>
                      <SelectItem value={VehicleStatus.MAINTENANCE}>Manutenção</SelectItem>
                      <SelectItem value={VehicleStatus.SOLD}>Vendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleStatusManager;
