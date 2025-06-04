
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Phone, Clock, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
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

const Index = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Dados dos veículos em destaque com imagens reais
  const featuredVehicles = [
    {
      id: 1,
      brand: "Toyota",
      model: "Corolla XEi",
      year: 2023,
      price: 159900,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60",
      mileage: 12000,
      fuel: "Flex"
    }, 
    {
      id: 2,
      brand: "Honda",
      model: "Civic Touring",
      year: 2022,
      price: 175000,
      image: "https://images.unsplash.com/photo-1606611013653-84667c136413?w=500&auto=format&fit=crop&q=60",
      mileage: 22000,
      fuel: "Flex"
    }, 
    {
      id: 3,
      brand: "BMW",
      model: "320i Sport",
      year: 2023,
      price: 289900,
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&auto=format&fit=crop&q=60",
      mileage: 8000,
      fuel: "Gasolina"
    },
    {
      id: 4,
      brand: "Mercedes-Benz",
      model: "C200 AMG Line",
      year: 2023,
      price: 385000,
      image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&auto=format&fit=crop&q=60",
      mileage: 5000,
      fuel: "Gasolina"
    },
    {
      id: 5,
      brand: "Audi",
      model: "Q5 Prestige",
      year: 2022,
      price: 359900,
      image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=500&auto=format&fit=crop&q=60",
      mileage: 18000,
      fuel: "Gasolina"
    },
    {
      id: 6,
      brand: "Volkswagen",
      model: "Tiguan R-Line",
      year: 2023,
      price: 249900,
      image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&auto=format&fit=crop&q=60",
      mileage: 9500,
      fuel: "Flex"
    }
  ];

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-white/5" />
        
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src="/lovable-uploads/036ab825-6eaf-4b89-80d5-2a042eb149f9.png" 
              alt="Lord Motors Logo" 
              className="h-32 w-auto"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-6">
            Lord<span className="text-accent">Motors</span>
          </h1>
          <p className="text-xl md:text-2xl font-opensans mb-8 max-w-2xl mx-auto text-gray-300">
            Sua plataforma premium para compra e venda de carros com excelência e confiança
          </p>
          <div className="space-x-4">
            <Link to="/vehicles">
              <Button size="lg" className="bg-accent text-black hover:bg-accent/90 font-opensans font-bold px-8 py-4 text-lg">
                Ver Estoque
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-black font-opensans font-bold px-8 py-4 text-lg">
                Sobre Nós
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Company Information Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-montserrat font-bold text-black mb-4">
              Nossa Loja
            </h2>
            <p className="text-lg font-opensans text-gray-600 max-w-2xl mx-auto">
              Garagem de automóveis em Campo Grande, Mato Grosso do Sul
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-accent mt-1" />
                <div>
                  <h3 className="text-xl font-montserrat font-bold text-black mb-2">Endereço</h3>
                  <p className="font-opensans text-gray-600">
                    Av. Nelly Martins, 352 - Carandá Bosque<br />
                    Campo Grande - MS, 79022-395
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-accent mt-1" />
                <div>
                  <h3 className="text-xl font-montserrat font-bold text-black mb-2">Telefone</h3>
                  <p className="font-opensans text-gray-600">(67) 3025-7770</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-accent mt-1" />
                <div>
                  <h3 className="text-xl font-montserrat font-bold text-black mb-2">Horário de Funcionamento</h3>
                  <p className="font-opensans text-gray-600">
                    Segunda a Sábado: 08:00 às 18:00<br />
                    Domingo: Fechado
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-xl">
              <h3 className="text-2xl font-montserrat font-bold text-black mb-6 flex items-center">
                <Star className="h-6 w-6 text-accent mr-2" />
                Avaliações dos Clientes
              </h3>
              
              <div className="space-y-6">
                <div className="border-l-4 border-accent pl-4">
                  <p className="font-opensans text-gray-700 mb-2">
                    "Desde o primeiro atendimento até a entrega do veículo."
                  </p>
                  <p className="font-opensans text-sm text-gray-500 font-semibold">
                    - Alex Junior
                  </p>
                </div>
                
                <div className="border-l-4 border-accent pl-4">
                  <p className="font-opensans text-gray-700 mb-2">
                    "Profissionais honestos e transparentes, ótimo atendimento!"
                  </p>
                  <p className="font-opensans text-sm text-gray-500 font-semibold">
                    - Pedro Henrique Goes Arantes
                  </p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="font-opensans text-sm text-gray-600 text-center">
                  Avaliações reais do Google Reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
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
              <VehicleCard key={vehicle.id} vehicle={vehicle} onViewDetails={handleViewDetails} />
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

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-montserrat font-bold text-black mb-4">
              Por que escolher a Lord Motors?
            </h2>
            <p className="text-lg font-opensans text-gray-600 max-w-2xl mx-auto">
              Oferecemos a melhor experiência em compra e venda de veículos com tecnologia de ponta
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up bg-white">
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-xl font-montserrat font-bold text-black mb-4">Qualidade Garantida</h3>
              <p className="font-opensans text-gray-600">
                Todos os veículos passam por rigorosa inspeção antes de serem disponibilizados
              </p>
            </div>
            
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up bg-white">
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-montserrat font-bold text-black mb-4">Melhor Preço</h3>
              <p className="font-opensans text-gray-600">
                Preços competitivos e transparentes, sem taxas ocultas ou surpresas
              </p>
            </div>
            
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up bg-white">
              <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-montserrat font-bold text-black mb-4">Atendimento Premium</h3>
              <p className="font-opensans text-gray-600">
                Equipe especializada pronta para atender suas necessidades com excelência
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-montserrat font-bold text-white mb-6">
            Pronto para encontrar seu próximo carro?
          </h2>
          <p className="text-xl font-opensans text-gray-300 mb-8 max-w-2xl mx-auto">
            Explore nosso estoque completo e encontre o veículo perfeito para você
          </p>
          <Link to="/vehicles">
            <Button size="lg" className="bg-accent text-black hover:bg-accent/90 font-opensans font-bold px-12 py-4 text-lg">
              Explorar Veículos
            </Button>
          </Link>
        </div>
      </section>

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

export default Index;
