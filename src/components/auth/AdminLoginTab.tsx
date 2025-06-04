
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock } from "lucide-react";

interface AdminLoginTabProps {
  onSubmit: (credentials: { username: string; password: string }) => Promise<void>;
  isLoading: boolean;
}

const AdminLoginTab = ({ onSubmit, isLoading }: AdminLoginTabProps) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="admin-username" className="font-opensans">Usuário</Label>
        <div className="relative">
          <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="admin-username"
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
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
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
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
  );
};

export default AdminLoginTab;
