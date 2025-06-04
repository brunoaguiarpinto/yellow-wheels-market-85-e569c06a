
import { MapPin, Phone, Clock, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-montserrat font-bold mb-4">
            Nossa Loja
          </h2>
          <p className="text-lg font-opensans text-gray-300 max-w-2xl mx-auto">
            Garagem de automóveis em Campo Grande, Mato Grosso do Sul
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-montserrat font-bold mb-2">Endereço</h3>
                <p className="font-opensans text-gray-300">
                  Av. Nelly Martins, 352 - Carandá Bosque<br />
                  Campo Grande - MS, 79022-395
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-montserrat font-bold mb-2">Telefone</h3>
                <p className="font-opensans text-gray-300">(67) 3025-7770</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Clock className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-montserrat font-bold mb-2">Horário de Funcionamento</h3>
                <p className="font-opensans text-gray-300">
                  Segunda a Sábado: 08:00 às 18:00<br />
                  Domingo: Fechado
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-8 rounded-lg">
            <h3 className="text-xl font-montserrat font-bold mb-6 flex items-center">
              <Star className="h-6 w-6 text-accent mr-2" />
              Avaliações dos Clientes
            </h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-accent pl-4">
                <p className="font-opensans text-gray-300 mb-2">
                  "Desde o primeiro atendimento até a entrega do veículo."
                </p>
                <p className="font-opensans text-sm text-gray-400 font-semibold">
                  - Alex Junior
                </p>
              </div>
              
              <div className="border-l-4 border-accent pl-4">
                <p className="font-opensans text-gray-300 mb-2">
                  "Profissionais honestos e transparentes, ótimo atendimento!"
                </p>
                <p className="font-opensans text-sm text-gray-400 font-semibold">
                  - Pedro Henrique Goes Arantes
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="font-opensans text-sm text-gray-400 text-center">
                Avaliações reais do Google Reviews
              </p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-700" />
        
        <div className="text-center">
          <p className="font-opensans text-gray-400">
            © 2024 Lord Motors. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
