
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary" />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-montserrat font-black mb-6">
            Auto<span className="text-accent">Deal</span>
          </h1>
          <p className="text-xl md:text-2xl font-opensans mb-8 max-w-2xl mx-auto">
            Sua plataforma premium para compra e venda de carros com excelência e confiança
          </p>
          <div className="space-x-4">
            <Link to="/vehicles">
              <Button size="lg" className="bg-accent text-black hover:bg-accent/90 font-opensans font-bold px-8 py-4 text-lg">
                Ver Estoque
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black font-opensans font-bold px-8 py-4 text-lg">
                Sobre Nós
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-montserrat font-bold text-black mb-4">
              Por que escolher a AutoDeal?
            </h2>
            <p className="text-lg font-opensans text-gray-600 max-w-2xl mx-auto">
              Oferecemos a melhor experiência em compra e venda de veículos com tecnologia de ponta
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-xl font-montserrat font-bold text-black mb-4">Qualidade Garantida</h3>
              <p className="font-opensans text-gray-600">
                Todos os veículos passam por rigorosa inspeção antes de serem disponibilizados
              </p>
            </div>
            
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-montserrat font-bold text-black mb-4">Melhor Preço</h3>
              <p className="font-opensans text-gray-600">
                Preços competitivos e transparentes, sem taxas ocultas ou surpresas
              </p>
            </div>
            
            <div className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow duration-300 animate-slide-up">
              <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center">
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
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-montserrat font-bold text-white mb-6">
            Pronto para encontrar seu próximo carro?
          </h2>
          <p className="text-xl font-opensans text-white/90 mb-8 max-w-2xl mx-auto">
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
