
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-black mb-6">
              Sobre a AutoDeal
            </h1>
            <p className="text-xl font-opensans text-gray-600 max-w-3xl mx-auto">
              Há mais de 10 anos no mercado, somos referência em compra e venda de veículos, 
              oferecendo transparência, qualidade e o melhor atendimento ao cliente.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16 animate-slide-up">
            <div>
              <h2 className="text-3xl font-montserrat font-bold text-black mb-6">
                Nossa História
              </h2>
              <p className="font-opensans text-gray-600 mb-4">
                A AutoDeal nasceu da paixão por automóveis e do compromisso em oferecer uma experiência 
                diferenciada no mercado automotivo. Desde nossa fundação, temos como missão conectar pessoas 
                aos seus carros dos sonhos através de um processo transparente e confiável.
              </p>
              <p className="font-opensans text-gray-600">
                Com uma equipe de especialistas apaixonados por carros, oferecemos não apenas veículos de 
                qualidade, mas também consultoria personalizada para cada cliente encontrar exatamente 
                o que procura.
              </p>
            </div>
            <div className="bg-gradient-primary rounded-lg p-8 text-center">
              <div className="text-white">
                <div className="text-4xl font-montserrat font-bold mb-2">1000+</div>
                <div className="font-opensans">Veículos Vendidos</div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16 animate-slide-up">
            <h2 className="text-3xl font-montserrat font-bold text-center text-black mb-12">
              Nossos Valores
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-white text-2xl">
                    🎯
                  </div>
                  <h3 className="text-xl font-montserrat font-bold text-black">Transparência</h3>
                  <p className="font-opensans text-gray-600">
                    Fornecemos todas as informações necessárias sobre cada veículo, sem surpresas
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-white text-2xl">
                    ⭐
                  </div>
                  <h3 className="text-xl font-montserrat font-bold text-black">Excelência</h3>
                  <p className="font-opensans text-gray-600">
                    Buscamos sempre a perfeição em nossos serviços e no atendimento ao cliente
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center text-white text-2xl">
                    🤝
                  </div>
                  <h3 className="text-xl font-montserrat font-bold text-black">Confiança</h3>
                  <p className="font-opensans text-gray-600">
                    Construímos relacionamentos duradouros baseados na confiança mútua
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Team Section */}
          <div className="animate-slide-up">
            <h2 className="text-3xl font-montserrat font-bold text-center text-black mb-12">
              Nossa Equipe
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { name: "Carlos Silva", role: "Diretor Geral", image: "/placeholder.svg" },
                { name: "Ana Santos", role: "Gerente de Vendas", image: "/placeholder.svg" },
                { name: "Roberto Lima", role: "Especialista Técnico", image: "/placeholder.svg" },
                { name: "Marina Costa", role: "Atendimento ao Cliente", image: "/placeholder.svg" }
              ].map((member, index) => (
                <Card key={index} className="text-center overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="font-montserrat font-bold text-black mb-2">{member.name}</h3>
                      <p className="font-opensans text-gray-600">{member.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
