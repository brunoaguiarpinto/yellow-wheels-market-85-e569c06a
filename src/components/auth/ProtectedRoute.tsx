
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

  // Allow access if we have a user, even if profile is temporarily unavailable
  // This prevents infinite loading when profile fetch fails
  if (user && !profile) {
    console.log('⚠️ ProtectedRoute: User exists but no profile - allowing basic access');
    
    // For admin/manager requirements, we need the profile to check roles
    if (requireAdmin || requireManager) {
      console.log('🚫 ProtectedRoute: Role-based access requires profile');
      return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-orange-600 mb-4">Perfil não encontrado</h1>
            <p className="text-gray-600 mb-4">Não foi possível carregar seu perfil de usuário.</p>
            <p className="text-sm text-gray-500">
              Isso pode indicar um problema de configuração. Entre em contato com o administrador.
            </p>
          </div>
        </div>
      );
    }
    
    // For basic access, allow the user through even without profile
    console.log('✅ ProtectedRoute: Basic access granted without profile');
    return <>{children}</>;
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
