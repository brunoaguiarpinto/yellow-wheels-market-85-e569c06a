
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import VehicleCard from "@/components/VehicleCard";

const Index = () => {
  // Dados dos veículos em destaque
  const featuredVehicles = [{
    id: 1,
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    price: 89000,
    image: "/placeholder.svg",
    mileage: 15000,
    fuel: "Flex"
  }, {
    id: 2,
    brand: "Honda",
    model: "Civic",
    year: 2021,
    price: 95000,
    image: "/placeholder.svg",
    mileage: 22000,
    fuel: "Flex"
  }, {
    id: 3,
    brand: "BMW",
    model: "320i",
    year: 2022,
    price: 180000,
    image: "/placeholder.svg",
    mileage: 12000,
    fuel: "Gasolina"
  }];

  const handleViewDetails = (vehicle: any) => {
    // Redirecionar para a página de veículos com o veículo selecionado
    window.location.href = '/vehicles';
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
            {featuredVehicles.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} onViewDetails={handleViewDetails} />)}
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
    </div>
  );
};

export default Index;
