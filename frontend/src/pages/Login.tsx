
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const handleAdminLogin = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);

    try {
      const success = await login(credentials.email, credentials.password);
      
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
      const success = await login(credentials.email, credentials.password);
      
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
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
      <Card className="w-full max-w-md mx-auto animate-fade-in shadow-lg">
        <CardHeader className="text-center px-4 sm:px-6 pt-6 sm:pt-8">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="bg-accent p-3 sm:p-4 rounded-full">
              <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-montserrat font-bold leading-tight">
            Acesso ao Sistema
          </CardTitle>
          <p className="font-opensans text-gray-600 text-sm sm:text-base mt-2">
            Lord Veículos - Selecione seu tipo de acesso
          </p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
              <TabsTrigger value="admin" className="flex items-center justify-center space-x-2 text-xs sm:text-sm py-2 px-2">
                <Shield className="h-4 w-4 flex-shrink-0" />
                <span className="hidden xs:inline">Administrador</span>
                <span className="xs:hidden">Admin</span>
              </TabsTrigger>
              <TabsTrigger value="employee" className="flex items-center justify-center space-x-2 text-xs sm:text-sm py-2 px-2">
                <User className="h-4 w-4 flex-shrink-0" />
                <span className="hidden xs:inline">Funcionário</span>
                <span className="xs:hidden">Func.</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin" className="space-y-4">
              <AdminLoginTab onSubmit={handleAdminLogin} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="employee" className="space-y-4">
              <EmployeeLoginTab onSubmit={handleEmployeeLogin} isLoading={isLoading} />
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6">
            <Button 
              asChild
              type="button" 
              variant="link" 
              className="text-accent font-opensans text-sm sm:text-base p-2 min-h-10 touch-manipulation"
            >
              <Link to="/forgot-password">Esqueci a Senha</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
