
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  employeeId?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'employee') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Recuperar usuário do localStorage na inicialização
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('AuthContext - User loaded from localStorage:', parsedUser);
      } catch (error) {
        console.error('AuthContext - Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'employee'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulação de autenticação - em produção seria uma API real
      if (role === 'admin' && email === 'admin' && password === 'admin') {
        const adminUser: User = {
          id: 'admin-1',
          name: 'Administrador',
          email: 'admin@lordveiculos.com',
          role: 'admin',
          permissions: [] // Admin tem acesso a tudo
        };
        setUser(adminUser);
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        console.log('AuthContext - Admin login successful:', adminUser);
        setIsLoading(false);
        return true;
      }

      // Verificar funcionários cadastrados
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const employee = employees.find((emp: any) => emp.email === email && emp.password === password);
      
      if (employee && role === 'employee') {
        const employeeUser: User = {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: 'employee',
          employeeId: employee.id,
          permissions: employee.permissions || []
        };
        setUser(employeeUser);
        localStorage.setItem('currentUser', JSON.stringify(employeeUser));
        console.log('AuthContext - Employee login successful:', employeeUser);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('AuthContext - Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    console.log('AuthContext - User logged out');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee',
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
