
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

  useEffect(() => {
    // Recuperar usuário do localStorage na inicialização
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'employee'): Promise<boolean> => {
    // Simulação de autenticação - em produção seria uma API real
    if (role === 'admin' && email === 'admin' && password === 'admin') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Administrador',
        email: 'admin@lordveiculos.com',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
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
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
