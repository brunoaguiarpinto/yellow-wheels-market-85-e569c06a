
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock } from "lucide-react";

interface EmployeeLoginTabProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  isLoading: boolean;
}

const EmployeeLoginTab = ({ onSubmit, isLoading }: EmployeeLoginTabProps) => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div>
        <Label htmlFor="employee-email" className="font-opensans text-sm sm:text-base mb-2 block">
          Email
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="employee-email"
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            placeholder="seu.email@lordveiculos.com"
            className="font-opensans pl-10 h-12 text-base touch-manipulation"
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="employee-password" className="font-opensans text-sm sm:text-base mb-2 block">
          Senha
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="employee-password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            placeholder="Digite sua senha"
            className="font-opensans pl-10 h-12 text-base touch-manipulation"
            required
          />
        </div>
      </div>
      <Button 
        type="submit" 
        className="w-full bg-accent text-black hover:bg-accent/90 font-opensans font-semibold h-12 text-base touch-manipulation"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar como Funcionário"}
      </Button>
    </form>
  );
};

export default EmployeeLoginTab;
