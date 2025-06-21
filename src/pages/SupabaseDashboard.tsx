
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { User } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SupabaseVehicleManagement from "@/components/admin/SupabaseVehicleManagement";
import SupabaseEmployeeManagement from "@/components/admin/SupabaseEmployeeManagement";
import CustomerManagement from "@/components/admin/CustomerManagement";
import AdvancedCRM from "@/components/crm/AdvancedCRM";
import AdvancedFinancial from "@/components/financial/AdvancedFinancial";
import ContractsModule from "@/components/contracts/ContractsModule";
import ReportsModule from "@/components/reports/ReportsModule";

const SupabaseDashboard = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("vehicles");

  const renderContent = () => {
    switch (activeTab) {
      case "vehicles":
        return <SupabaseVehicleManagement />;
      case "employees":
        return (
          <ProtectedRoute requireAdmin={true}>
            <SupabaseEmployeeManagement />
          </ProtectedRoute>
        );
      case "customers":
        return <CustomerManagement />;
      case "crm":
        return <AdvancedCRM />;
      case "financial":
        return (
          <ProtectedRoute requireManager={true}>
            <AdvancedFinancial />
          </ProtectedRoute>
        );
      case "contracts":
        return (
          <ProtectedRoute requireManager={true}>
            <ContractsModule />
          </ProtectedRoute>
        );
      case "reports":
        return (
          <ProtectedRoute requireManager={true}>
            <ReportsModule />
          </ProtectedRoute>
        );
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="font-opensans text-gray-600">
                  {profile?.name} ({profile?.role})
                </span>
              </div>
              <Button 
                variant="outline" 
                onClick={signOut}
                className="font-opensans"
              >
                Sair
              </Button>
            </div>
          </div>

          {renderContent()}
        </div>
      </AdminSidebar>
    </ProtectedRoute>
  );
};

export default SupabaseDashboard;
