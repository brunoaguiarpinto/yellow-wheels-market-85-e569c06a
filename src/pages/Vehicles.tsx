import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { Vehicle as FullVehicle } from "@/types/vehicle"; // Importando o tipo completo

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import VehicleCard from "@/components/VehicleCard";
import { Search, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Tipo local para corresponder ao que VehicleCard espera
interface VehicleForCard {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  mileage: number;
  fuel: string;
}

const fetchVehicles = async (): Promise<VehicleForCard[]> => {
  const { data } = await api.get<FullVehicle[]>('/vehicles');
  // Mapeia os dados completos da API para o formato que o Card espera
  return data.map((vehicle) => ({
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    price: vehicle.price,
    mileage: vehicle.mileage,
    fuel: vehicle.fuel,
    image: vehicle.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60',
  }));
};

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleForCard | null>(null);

  const { data: vehicles = [], isLoading, isError } = useQuery<VehicleForCard[]>({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || selectedBrand === "all" || vehicle.brand === selectedBrand;
    const matchesYear = !selectedYear || selectedYear === "all" || vehicle.year.toString() === selectedYear;
    
    return matchesSearch && matchesBrand && matchesYear;
  });

  const brands = [...new Set(vehicles.map(v => v.brand))].filter(Boolean);
  const years = [...new Set(vehicles.map(v => v.year.toString()))].filter(Boolean).sort().reverse();

  const handleViewDetails = (vehicle: VehicleForCard) => {
    setSelectedVehicle(vehicle);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-xl font-opensans text-red-600">
            Erro ao carregar os veículos. Tente novamente mais tarde.
          </p>
        </div>
      );
    }

    if (vehicles.length === 0) {
      return (
        <div className="text-center py-12 animate-fade-in">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-montserrat font-bold text-gray-900 mb-4">
              Nenhum veículo em estoque
            </h3>
            <p className="text-lg font-opensans text-gray-600 mb-6">
              Estamos preparando nosso estoque. Em breve você encontrará aqui uma seleção incrível de carros!
            </p>
            <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold">
              Entre em Contato
            </Button>
          </div>
        </div>
      );
    }

    if (filteredVehicles.length === 0) {
      return (
        <div className="text-center py-12 animate-fade-in">
          <p className="text-xl font-opensans text-gray-600">
            Nenhum veículo encontrado com os filtros selecionados.
          </p>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
        {filteredVehicles.map(vehicle => (
          <VehicleCard 
            key={vehicle.id} 
            vehicle={vehicle} 
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-black mb-4">
              Nosso Estoque
            </h1>
            <p className="text-xl font-opensans text-gray-600 max-w-2xl mx-auto">
              Encontre o veículo perfeito para você em nossa seleção premium
            </p>
          </div>

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
                    <SelectItem value="all">Todas as marcas</SelectItem>
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
                    <SelectItem value="all">Todos os anos</SelectItem>
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

          <div className="flex justify-center space-x-4 mb-8 animate-slide-up">
            <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold px-8">
              Quero Comprar
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-black font-opensans font-semibold px-8">
              Quero Vender
            </Button>
          </div>

          {renderContent()}
        </div>
      </div>

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
    </div>
  );
};

export default Vehicles;
