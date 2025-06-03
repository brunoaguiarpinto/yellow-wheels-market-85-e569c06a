
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import VehicleCard from "@/components/VehicleCard";
import { Search } from "lucide-react";

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

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Mock data - substituir por dados reais posteriormente
  const vehicles: Vehicle[] = [
    {
      id: 1,
      brand: "Toyota",
      model: "Corolla",
      year: 2022,
      price: 89000,
      image: "/placeholder.svg",
      mileage: 15000,
      fuel: "Flex"
    },
    {
      id: 2,
      brand: "Honda",
      model: "Civic",
      year: 2021,
      price: 95000,
      image: "/placeholder.svg",
      mileage: 22000,
      fuel: "Flex"
    },
    {
      id: 3,
      brand: "Volkswagen",
      model: "Jetta",
      year: 2023,
      price: 105000,
      image: "/placeholder.svg",
      mileage: 8000,
      fuel: "Flex"
    },
    {
      id: 4,
      brand: "BMW",
      model: "320i",
      year: 2022,
      price: 180000,
      image: "/placeholder.svg",
      mileage: 12000,
      fuel: "Gasolina"
    },
    {
      id: 5,
      brand: "Mercedes",
      model: "C200",
      year: 2021,
      price: 195000,
      image: "/placeholder.svg",
      mileage: 18000,
      fuel: "Gasolina"
    },
    {
      id: 6,
      brand: "Audi",
      model: "A3",
      year: 2023,
      price: 145000,
      image: "/placeholder.svg",
      mileage: 5000,
      fuel: "Flex"
    }
  ];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || vehicle.brand === selectedBrand;
    const matchesYear = !selectedYear || vehicle.year.toString() === selectedYear;
    
    return matchesSearch && matchesBrand && matchesYear;
  });

  const brands = [...new Set(vehicles.map(v => v.brand))];
  const years = [...new Set(vehicles.map(v => v.year.toString()))].sort().reverse();

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-black mb-4">
              Nosso Estoque
            </h1>
            <p className="text-xl font-opensans text-gray-600 max-w-2xl mx-auto">
              Encontre o veículo perfeito para você em nossa seleção premium
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8 animate-slide-up">
            <CardHeader>
              <CardTitle className="font-montserrat">Filtrar Veículos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar marca ou modelo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-opensans"
                  />
                </div>
                
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="font-opensans">
                    <SelectValue placeholder="Todas as marcas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as marcas</SelectItem>
                    {brands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="font-opensans">
                    <SelectValue placeholder="Todos os anos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os anos</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedBrand("");
                    setSelectedYear("");
                  }}
                  variant="outline"
                  className="font-opensans"
                >
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8 animate-slide-up">
            <Button className="bg-gradient-primary hover:bg-gradient-secondary text-white font-opensans font-semibold px-8">
              Quero Comprar
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-black font-opensans font-semibold px-8">
              Quero Vender
            </Button>
          </div>

          {/* Vehicles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {filteredVehicles.map(vehicle => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-xl font-opensans text-gray-600">
                Nenhum veículo encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Details Modal */}
      <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
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
                <Button className="flex-1 bg-gradient-primary hover:bg-gradient-secondary text-white font-opensans font-semibold">
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
    </div>
  );
};

export default Vehicles;
