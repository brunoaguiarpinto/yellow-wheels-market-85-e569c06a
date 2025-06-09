
import { MapPin, Phone, Clock, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-montserrat font-bold mb-3 sm:mb-4">
            Nossa Loja
          </h2>
          <p className="text-base sm:text-lg font-opensans text-gray-300 max-w-2xl mx-auto px-4">
            Garagem de automóveis em Campo Grande, Mato Grosso do Sul
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-start space-x-4 p-4 sm:p-0">
              <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-montserrat font-bold mb-2">Endereço</h3>
                <p className="font-opensans text-gray-300 text-sm sm:text-base leading-relaxed">
                  Av. Nelly Martins, 352 - Carandá Bosque<br />
                  Campo Grande - MS, 79022-395
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 sm:p-0">
              <Phone className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-montserrat font-bold mb-2">Telefone</h3>
                <p className="font-opensans text-gray-300 text-sm sm:text-base">
                  <a href="tel:+556730257770" className="hover:text-accent transition-colors">
                    (67) 3025-7770
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 sm:p-0">
              <Clock className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-montserrat font-bold mb-2">Horário de Funcionamento</h3>
                <p className="font-opensans text-gray-300 text-sm sm:text-base leading-relaxed">
                  Segunda a Sábado: 08:00 às 18:00<br />
                  Domingo: Fechado
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 sm:p-8 rounded-lg mx-4 sm:mx-0">
            <h3 className="text-lg sm:text-xl font-montserrat font-bold mb-4 sm:mb-6 flex items-center">
              <Star className="h-6 w-6 text-accent mr-2 flex-shrink-0" />
              Avaliações dos Clientes
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="border-l-4 border-accent pl-4">
                <p className="font-opensans text-gray-300 mb-2 text-sm sm:text-base leading-relaxed">
                  "Desde o primeiro atendimento até a entrega do veículo."
                </p>
                <p className="font-opensans text-xs sm:text-sm text-gray-400 font-semibold">
                  - Alex Junior
                </p>
              </div>
              
              <div className="border-l-4 border-accent pl-4">
                <p className="font-opensans text-gray-300 mb-2 text-sm sm:text-base leading-relaxed">
                  "Profissionais honestos e transparentes, ótimo atendimento!"
                </p>
                <p className="font-opensans text-xs sm:text-sm text-gray-400 font-semibold">
                  - Pedro Henrique Goes Arantes
                </p>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700">
              <p className="font-opensans text-xs sm:text-sm text-gray-400 text-center">
                Avaliações reais do Google Reviews
              </p>
            </div>
          </div>
        </div>
        
        <Separator className="my-6 sm:my-8 bg-gray-700" />
        
        <div className="text-center px-4">
          <p className="font-opensans text-gray-400 text-sm sm:text-base">
            © 2024 Lord Motors. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
