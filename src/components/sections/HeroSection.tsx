
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-16 sm:pt-20">
      <div className="absolute inset-0 bg-white/5" />
      
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 animate-fade-in max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <img 
            src="/lovable-uploads/036ab825-6eaf-4b89-80d5-2a042eb149f9.png" 
            alt="Lord Motors Logo" 
            className="h-20 sm:h-24 md:h-32 w-auto"
          />
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-montserrat font-black mb-4 sm:mb-6 leading-tight">
          Lord<span className="text-accent">Motors</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-opensans mb-6 sm:mb-8 text-gray-300 leading-relaxed px-2">
          Sua plataforma premium para compra e venda de carros com excelência e confiança
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center items-center">
          <Link to="/vehicles" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-accent text-black hover:bg-accent/90 font-opensans font-bold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-12 touch-manipulation"
            >
              Ver Estoque
            </Button>
          </Link>
          <Link to="/about" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto border-white bg-transparent text-white hover:bg-white hover:text-black font-opensans font-bold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-12 touch-manipulation"
            >
              Sobre Nós
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
