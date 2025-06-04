
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  mileage: number;
  fuel: string;
}

interface VehicleDetailsModalProps {
  selectedVehicle: Vehicle | null;
  onClose: () => void;
}

const VehicleDetailsModal = ({ selectedVehicle, onClose }: VehicleDetailsModalProps) => {
  return (
    <Dialog open={!!selectedVehicle} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-montserrat text-2xl">
            {selectedVehicle?.brand} {selectedVehicle?.model}
          </DialogTitle>
        </DialogHeader>
        
        {selectedVehicle && (
          <div className="space-y-6">
            <img 
              src={selectedVehicle.image} 
              alt={`${selectedVehicle.brand} ${selectedVehicle.model}`}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="grid grid-cols-2 gap-4 font-opensans">
              <div>
                <span className="font-semibold">Ano:</span> {selectedVehicle.year}
              </div>
              <div>
                <span className="font-semibold">Km:</span> {selectedVehicle.mileage.toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Combustível:</span> {selectedVehicle.fuel}
              </div>
              <div>
                <span className="font-semibold">Preço:</span> 
                <span className="text-accent font-bold ml-2">
                  R$ {selectedVehicle.price.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button className="flex-1 bg-accent text-black hover:bg-accent/90 font-opensans font-semibold">
                Tenho Interesse
              </Button>
              <Button variant="outline" className="flex-1 border-accent text-accent hover:bg-accent hover:text-black font-opensans font-semibold">
                Falar com Vendedor
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsModal;
