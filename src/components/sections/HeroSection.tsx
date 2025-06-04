
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
