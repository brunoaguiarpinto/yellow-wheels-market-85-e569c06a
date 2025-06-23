
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  mileage: number;
  fuel: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicle: Vehicle) => void;
}

const VehicleCard = ({ vehicle, onViewDetails }: VehicleCardProps) => {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <img 
            src={vehicle.image} 
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <h3 className="text-xl font-montserrat font-bold text-gray-900 mb-2">
          {vehicle.brand} {vehicle.model}
        </h3>
        <div className="space-y-2 text-sm font-opensans text-gray-600">
          <p>Ano: {vehicle.year}</p>
          <p>Km: {vehicle.mileage.toLocaleString()}</p>
          <p>Combustível: {vehicle.fuel}</p>
        </div>
        <div className="mt-4">
          <span className="text-2xl font-montserrat font-bold text-accent">
            R$ {vehicle.price.toLocaleString()}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 space-x-2">
        <Button 
          onClick={() => onViewDetails(vehicle)}
          className="flex-1 bg-black hover:bg-black/90 text-white font-opensans font-semibold"
        >
          Ver Detalhes
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 border-accent text-accent hover:bg-accent hover:text-black font-opensans font-semibold"
        >
          Contato
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
