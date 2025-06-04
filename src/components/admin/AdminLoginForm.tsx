
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdminLoginFormProps {
  onLogin: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
}

const AdminLoginForm = ({ onLogin, isLoading }: AdminLoginFormProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-montserrat font-bold">
            Painel Administrativo
          </CardTitle>
          <p className="font-opensans text-gray-600">
            Lord Veículos - Faça login para acessar o sistema
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="font-opensans">Usuário</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite: admin"
                className="font-opensans"
              />
            </div>
            <div>
              <Label htmlFor="password" className="font-opensans">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite: admin"
                className="font-opensans"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-accent text-black hover:bg-accent/90 font-opensans font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <Button 
              type="button" 
              variant="link" 
              className="w-full text-accent font-opensans"
            >
              Esqueci a Senha
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginForm;
