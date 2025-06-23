
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: "/", label: "Início" },
    { path: "/vehicles", label: "Ver Estoque" },
    { path: "/about", label: "Sobre Nós" },
    { path: "/contact", label: "Contato" },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-accent/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <img 
              src="/lovable-uploads/036ab825-6eaf-4b89-80d5-2a042eb149f9.png" 
              alt="Lord Motors Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-montserrat font-bold text-white">
              Lord<span className="text-accent">Motors</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`font-opensans transition-colors hover:text-accent px-3 py-2 ${
                  isActive(item.path) ? 'text-accent' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Admin Button */}
          <div className="hidden lg:block">
            <Link to="/admin">
              <Button className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold px-6 py-2">
                Administração
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            <Link to="/admin">
              <Button size="sm" className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold text-xs px-3 py-1">
                Admin
              </Button>
            </Link>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:text-accent hover:bg-white/10 p-2"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-72 bg-black/95 border-accent/20 backdrop-blur-sm"
              >
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8 pt-4">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="/lovable-uploads/036ab825-6eaf-4b89-80d5-2a042eb149f9.png" 
                        alt="Lord Motors Logo" 
                        className="h-8 w-auto"
                      />
                      <span className="text-lg font-montserrat font-bold text-white">
                        Lord<span className="text-accent">Motors</span>
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col space-y-2">
                    {navigationItems.map((item) => (
                      <Link 
                        key={item.path}
                        to={item.path}
                        onClick={closeMenu}
                        className={`font-opensans text-lg py-4 px-4 rounded-lg transition-colors ${
                          isActive(item.path) 
                            ? 'text-accent bg-accent/10 border border-accent/20' 
                            : 'text-white hover:text-accent hover:bg-white/5'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Admin Button */}
                  <div className="mt-auto mb-6">
                    <Link to="/admin" onClick={closeMenu}>
                      <Button className="w-full bg-accent text-black hover:bg-accent/90 font-opensans font-semibold py-3 text-base">
                        Painel Administrativo
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;
