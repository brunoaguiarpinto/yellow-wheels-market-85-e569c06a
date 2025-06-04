
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { User, Lock, Building2, Shield } from "lucide-react";

const Login = () => {
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: ""
  });
  const [employeeCredentials, setEmployeeCredentials] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(adminCredentials.username, adminCredentials.password, 'admin');
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao painel administrativo da Lord Veículos.",
        });
        navigate('/admin-dashboard');
      } else {
        toast({
          title: "Erro no login",
          description: "Usuário ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no sistema",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(employeeCredentials.email, employeeCredentials.password, 'employee');
      
      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao seu dashboard Lord Veículos.",
        });
        navigate('/employee-dashboard');
      } else {
        toast({
          title: "Erro no login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no sistema",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-accent p-3 rounded-full">
              <Building2 className="h-8 w-8 text-black" />
            </div>
          </div>
          <CardTitle className="text-3xl font-montserrat font-bold">
            Acesso ao Sistema
          </CardTitle>
          <p className="font-opensans text-gray-600">
            Lord Veículos - Selecione seu tipo de acesso
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Administrador</span>
              </TabsTrigger>
              <TabsTrigger value="employee" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Funcionário</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <Label htmlFor="admin-username" className="font-opensans">Usuário</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="admin-username"
                      type="text"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                      placeholder="Digite: admin"
                      className="font-opensans pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="admin-password" className="font-opensans">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="admin-password"
                      type="password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                      placeholder="Digite: admin"
                      className="font-opensans pl-10"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-accent text-black hover:bg-accent/90 font-opensans font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar como Administrador"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="employee">
              <form onSubmit={handleEmployeeLogin} className="space-y-4">
                <div>
                  <Label htmlFor="employee-email" className="font-opensans">Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="employee-email"
                      type="email"
                      value={employeeCredentials.email}
                      onChange={(e) => setEmployeeCredentials({...employeeCredentials, email: e.target.value})}
                      placeholder="seu.email@lordveiculos.com"
                      className="font-opensans pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="employee-password" className="font-opensans">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="employee-password"
                      type="password"
                      value={employeeCredentials.password}
                      onChange={(e) => setEmployeeCredentials({...employeeCredentials, password: e.target.value})}
                      placeholder="Digite sua senha"
                      className="font-opensans pl-10"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-accent text-black hover:bg-accent/90 font-opensans font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar como Funcionário"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-4">
            <Button 
              type="button" 
              variant="link" 
              className="text-accent font-opensans"
            >
              Esqueci a Senha
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
