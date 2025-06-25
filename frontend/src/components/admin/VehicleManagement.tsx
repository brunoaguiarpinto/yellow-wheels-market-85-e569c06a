
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash } from "lucide-react";
import VehicleForm from "@/components/VehicleForm";
import ConfirmationDialog from "@/components/modals/ConfirmationDialog";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  status: string;
}

interface VehicleManagementProps {
  vehicles: Vehicle[];
  onVehicleSubmit: (data: any) => void;
  onVehicleEdit: (vehicle: Vehicle) => void;
  onVehicleDelete: (vehicleId: string) => void;
}

const VehicleManagement = ({ 
  vehicles, 
  onVehicleSubmit, 
  onVehicleEdit, 
  onVehicleDelete 
}: VehicleManagementProps) => {
  const { toast } = useToast();
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [vehicleEditDialogOpen, setVehicleEditDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleVehicleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleEditDialogOpen(true);
    onVehicleEdit(vehicle);
  };

  const handleVehicleSubmit = (data: any) => {
    onVehicleSubmit(data);
    setVehicleDialogOpen(false);
    setVehicleEditDialogOpen(false);
    setEditingVehicle(null);
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setDeletingVehicle(vehicle);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingVehicle) {
      onVehicleDelete(deletingVehicle.id);
      toast({
        title: "Veículo excluído!",
        description: `O veículo ${deletingVehicle.brand} ${deletingVehicle.model} foi removido do sistema.`,
        variant: "destructive",
      });
      setDeletingVehicle(null);
    }
    setIsConfirmOpen(false);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-montserrat font-bold">Gerenciamento de Veículos</h2>
        <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-montserrat">Adicionar Novo Veículo</DialogTitle>
            </DialogHeader>
            <VehicleForm 
              onSubmit={handleVehicleSubmit}
              onCancel={() => setVehicleDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-opensans">Marca</TableHead>
                <TableHead className="font-opensans">Modelo</TableHead>
                <TableHead className="font-opensans">Ano</TableHead>
                <TableHead className="font-opensans">Preço</TableHead>
                <TableHead className="font-opensans">Status</TableHead>
                <TableHead className="font-opensans">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-opensans">{vehicle.brand}</TableCell>
                  <TableCell className="font-opensans">{vehicle.model}</TableCell>
                  <TableCell className="font-opensans">{vehicle.year}</TableCell>
                  <TableCell className="font-opensans">R$ {vehicle.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-opensans">
                      {vehicle.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleVehicleEdit(vehicle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteClick(vehicle)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {vehicles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="font-opensans text-gray-500">
                      Nenhum veículo cadastrado ainda.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={vehicleEditDialogOpen} onOpenChange={setVehicleEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-montserrat">Editar Veículo</DialogTitle>
          </DialogHeader>
          <VehicleForm 
            onSubmit={handleVehicleSubmit}
            onCancel={() => {
              setVehicleEditDialogOpen(false);
              setEditingVehicle(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Confirmar Exclusão`}
        description={`Tem certeza de que deseja excluir o veículo ${deletingVehicle?.brand} ${deletingVehicle?.model}? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default VehicleManagement;
