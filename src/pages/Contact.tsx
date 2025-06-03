
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-black mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl font-opensans text-gray-600 max-w-2xl mx-auto">
              Estamos prontos para ajudar você a encontrar o carro dos seus sonhos
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 animate-slide-up">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat text-2xl">Envie uma Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="font-opensans">Nome</Label>
                      <Input id="firstName" placeholder="Seu nome" className="font-opensans" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="font-opensans">Sobrenome</Label>
                      <Input id="lastName" placeholder="Seu sobrenome" className="font-opensans" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="font-opensans">E-mail</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" className="font-opensans" />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="font-opensans">Telefone</Label>
                    <Input id="phone" type="tel" placeholder="(11) 99999-9999" className="font-opensans" />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="font-opensans">Assunto</Label>
                    <Input id="subject" placeholder="Como podemos ajudar?" className="font-opensans" />
                  </div>
                  
                  <div>
                    <Label htmlFor="message" className="font-opensans">Mensagem</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Conte-nos mais detalhes..." 
                      className="min-h-[120px] font-opensans"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:bg-gradient-secondary text-white font-opensans font-semibold"
                  >
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat text-2xl">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 font-opensans">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm">
                      📍
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">Endereço</h3>
                      <p className="text-gray-600">
                        Av. Paulista, 1000<br />
                        São Paulo - SP, 01310-100
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm">
                      📞
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">Telefone</h3>
                      <p className="text-gray-600">(11) 3000-0000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm">
                      📧
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">E-mail</h3>
                      <p className="text-gray-600">contato@autodeal.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm">
                      🕒
                    </div>
                    <div>
                      <h3 className="font-semibold text-black mb-1">Horário de Funcionamento</h3>
                      <p className="text-gray-600">
                        Segunda à Sexta: 9h às 18h<br />
                        Sábado: 9h às 14h<br />
                        Domingo: Fechado
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-montserrat text-2xl">Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm" className="font-opensans">
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="font-opensans">
                      Instagram
                    </Button>
                    <Button variant="outline" size="sm" className="font-opensans">
                      WhatsApp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
