
import { useState } from "react";
import { Menu, X, Car, Users, Building2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-accent" />
              <span className="font-montserrat font-bold text-xl text-gray-900">
                Lord Veículos
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-opensans hover:text-accent transition-colors ${
                isActive("/") ? "text-accent font-semibold" : "text-gray-700"
              }`}
            >
              Início
            </Link>
            <Link
              to="/about"
              className={`font-opensans hover:text-accent transition-colors ${
                isActive("/about") ? "text-accent font-semibold" : "text-gray-700"
              }`}
            >
              Sobre
            </Link>
            <Link
              to="/vehicles"
              className={`font-opensans hover:text-accent transition-colors ${
                isActive("/vehicles") ? "text-accent font-semibold" : "text-gray-700"
              }`}
            >
              Veículos
            </Link>
            <Link
              to="/contact"
              className={`font-opensans hover:text-accent transition-colors ${
                isActive("/contact") ? "text-accent font-semibold" : "text-gray-700"
              }`}
            >
              Contato
            </Link>
            <Link
              to="/dashboard"
              className="bg-accent text-black px-4 py-2 rounded-lg font-opensans font-semibold hover:bg-accent/90 transition-colors flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-accent transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md font-opensans hover:bg-gray-100 transition-colors ${
                isActive("/") ? "text-accent font-semibold bg-gray-100" : "text-gray-700"
              }`}
            >
              Início
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md font-opensans hover:bg-gray-100 transition-colors ${
                isActive("/about") ? "text-accent font-semibold bg-gray-100" : "text-gray-700"
              }`}
            >
              Sobre
            </Link>
            <Link
              to="/vehicles"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md font-opensans hover:bg-gray-100 transition-colors ${
                isActive("/vehicles") ? "text-accent font-semibold bg-gray-100" : "text-gray-700"
              }`}
            >
              Veículos
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md font-opensans hover:bg-gray-100 transition-colors ${
                isActive("/contact") ? "text-accent font-semibold bg-gray-100" : "text-gray-700"
              }`}
            >
              Contato
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md bg-accent text-black font-opensans font-semibold hover:bg-accent/90 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Admin</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MobileNavbar;
