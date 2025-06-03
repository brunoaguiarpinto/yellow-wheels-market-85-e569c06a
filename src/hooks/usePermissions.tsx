
import { useAuth } from "@/contexts/AuthContext";

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions?.includes(permission) || false;
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
