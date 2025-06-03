
import { useAuth } from "@/contexts/AuthContext";

export const usePermissions = () => {
  const { user } = useAuth();

  console.log("usePermissions - user:", user); // Debug log

  const hasPermission = (permission: string) => {
    if (!user) {
      console.log("usePermissions - no user found");
      return false;
    }
    
    if (user.role === 'admin') {
      console.log("usePermissions - admin user, granting all permissions");
      return true;
    }
    
    const userPermissions = user.permissions || [];
    const hasAccess = userPermissions.includes(permission);
    
    console.log(`usePermissions - checking permission "${permission}":`, {
      userPermissions,
      hasAccess
    });
    
    return hasAccess;
  };

  return {
    hasPermission,
    canCreateVehicles: hasPermission('vehicles.create'),
    canEditVehicles: hasPermission('vehicles.edit'),
    canDeleteVehicles: hasPermission('vehicles.delete'),
    canCreateClients: hasPermission('clients.create'),
    canEditClients: hasPermission('clients.edit'),
    canViewSales: hasPermission('sales.view'),
    canCreateSales: hasPermission('sales.create'),
  };
};
