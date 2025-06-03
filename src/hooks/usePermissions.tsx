
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
    // Veículos
    canCreateVehicles: hasPermission('vehicles.create'),
    canEditVehicles: hasPermission('vehicles.edit'),
    canDeleteVehicles: hasPermission('vehicles.delete'),
    canViewVehicles: hasPermission('vehicles.view'),
    // Clientes
    canCreateClients: hasPermission('clients.create'),
    canEditClients: hasPermission('clients.edit'),
    canDeleteClients: hasPermission('clients.delete'),
    canViewClients: hasPermission('clients.view'),
    // Vendas
    canViewSales: hasPermission('sales.view'),
    canCreateSales: hasPermission('sales.create'),
    canEditSales: hasPermission('sales.edit'),
    canDeleteSales: hasPermission('sales.delete'),
    // Financeiro
    canViewFinancial: hasPermission('financial.view'),
    canCreatePurchases: hasPermission('financial.purchases'),
    canViewAnalysis: hasPermission('financial.analysis'),
    canExportReports: hasPermission('financial.export'),
    canManageInventory: hasPermission('financial.inventory'),
    // Funcionários
    canCreateEmployees: hasPermission('employees.create'),
    canEditEmployees: hasPermission('employees.edit'),
    canDeleteEmployees: hasPermission('employees.delete'),
    canViewEmployees: hasPermission('employees.view'),
  };
};
