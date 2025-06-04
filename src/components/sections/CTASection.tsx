
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
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
  );
};

export default CTASection;
