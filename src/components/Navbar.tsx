
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-accent/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-montserrat font-bold text-white">
            Auto<span className="text-accent">Deal</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`font-opensans transition-colors hover:text-accent ${
                isActive('/') ? 'text-accent' : 'text-white'
              }`}
            >
              Início
            </Link>
            <Link 
              to="/vehicles" 
              className={`font-opensans transition-colors hover:text-accent ${
                isActive('/vehicles') ? 'text-accent' : 'text-white'
              }`}
            >
              Ver Estoque
            </Link>
            <Link 
              to="/about" 
              className={`font-opensans transition-colors hover:text-accent ${
                isActive('/about') ? 'text-accent' : 'text-white'
              }`}
            >
              Sobre Nós
            </Link>
            <Link 
              to="/contact" 
              className={`font-opensans transition-colors hover:text-accent ${
                isActive('/contact') ? 'text-accent' : 'text-white'
              }`}
            >
              Contato
            </Link>
          </div>

          <Link to="/admin">
            <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold">
              Administração
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
