
import { useAuth } from "@/contexts/SupabaseAuthContext";
import AuthForm from "./AuthForm";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireManager?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, requireManager = false }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  console.log('🛡️ ProtectedRoute check:', {
    hasUser: !!user,
    hasProfile: !!profile,
    loading,
    userRole: profile?.role,
    requireAdmin,
    requireManager
  });

  if (loading) {
    console.log('⏳ ProtectedRoute: Still loading...');
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="font-opensans text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🚫 ProtectedRoute: No user, redirecting to auth');
    return <AuthForm />;
  }

  // Give a moment for profile to load after user is authenticated
  if (user && !profile) {
    console.log('⏳ ProtectedRoute: User exists but no profile yet, waiting...');
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="font-opensans text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (requireAdmin && profile?.role !== 'admin') {
    console.log('🚫 ProtectedRoute: Admin required but user is not admin');
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (requireManager && !['admin', 'manager'].includes(profile?.role || '')) {
    console.log('🚫 ProtectedRoute: Manager required but user is not manager/admin');
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  console.log('✅ ProtectedRoute: Access granted');
  return <>{children}</>;
};

export default ProtectedRoute;
