
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import VehicleCard from "@/components/VehicleCard";

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

interface FeaturedVehiclesSectionProps {
  featuredVehicles: Vehicle[];
  onViewDetails: (vehicle: Vehicle) => void;
}

const FeaturedVehiclesSection = ({ featuredVehicles, onViewDetails }: FeaturedVehiclesSectionProps) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl font-montserrat font-bold text-black mb-4">
            Veículos em Destaque
          </h2>
          <p className="text-lg font-opensans text-gray-600 max-w-2xl mx-auto">
            Confira nossa seleção especial de veículos premium disponíveis em nosso estoque
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredVehicles.slice(0, 3).map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} onViewDetails={onViewDetails} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/vehicles">
            <Button size="lg" className="bg-accent text-black hover:bg-accent/90 font-opensans font-bold px-8 py-4">
              Ver Todos os Veículos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehiclesSection;
