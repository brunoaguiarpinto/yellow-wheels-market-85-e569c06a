
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, Shield, User } from "lucide-react";
import AdminLoginTab from "@/components/auth/AdminLoginTab";
import EmployeeLoginTab from "@/components/auth/EmployeeLoginTab";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAdminLogin = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);

    try {
      const success = await login(credentials.username, credentials.password, 'admin');
      
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

  const handleEmployeeLogin = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);

    try {
      const success = await login(credentials.email, credentials.password, 'employee');
      
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
              <AdminLoginTab onSubmit={handleAdminLogin} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="employee">
              <EmployeeLoginTab onSubmit={handleEmployeeLogin} isLoading={isLoading} />
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
