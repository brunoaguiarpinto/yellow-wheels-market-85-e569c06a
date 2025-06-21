
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash } from "lucide-react";
import { useSupabaseData, useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";
import VehicleFormWithImages from "@/components/vehicles/VehicleFormWithImages";

const SupabaseVehicleManagement = () => {
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [vehicleEditDialogOpen, setVehicleEditDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const { toast } = useToast();

  const { data: vehicles, loading, refetch } = useSupabaseData('vehicles');
  const { insert: insertVehicle } = useSupabaseInsert('vehicles');
  const { update: updateVehicle } = useSupabaseUpdate('vehicles');
  const { deleteRecord: deleteVehicle } = useSupabaseDelete('vehicles');

  const handleVehicleSubmit = async (data: any) => {
    const result = await insertVehicle(data);
    if (result) {
      setVehicleDialogOpen(false);
      refetch();
    }
  };

  const handleVehicleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setVehicleEditDialogOpen(true);
  };

  const handleVehicleUpdate = async (data: any) => {
    if (editingVehicle) {
      const result = await updateVehicle(editingVehicle.id, data);
      if (result) {
        setVehicleEditDialogOpen(false);
        setEditingVehicle(null);
        refetch();
      }
    }
  };

  const handleVehicleDelete = async (vehicleId: string) => {
    const success = await deleteVehicle(vehicleId);
    if (success) {
      refetch();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

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
            <VehicleFormWithImages 
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
              {vehicles.map((vehicle: any) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-opensans">{vehicle.brand}</TableCell>
                  <TableCell className="font-opensans">{vehicle.model}</TableCell>
                  <TableCell className="font-opensans">{vehicle.year}</TableCell>
                  <TableCell className="font-opensans">R$ {vehicle.price?.toLocaleString()}</TableCell>
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
                        onClick={() => handleVehicleDelete(vehicle.id)}
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
          {editingVehicle && (
            <VehicleFormWithImages 
              initialData={editingVehicle}
              onSubmit={handleVehicleUpdate}
              onCancel={() => {
                setVehicleEditDialogOpen(false);
                setEditingVehicle(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupabaseVehicleManagement;
