import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { 
  Car, 
  Users, 
  User, 
  DollarSign,
  UserCheck,
  FileText,
  BarChart3
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const AdminSidebar = ({ activeTab, onTabChange, children }: AdminSidebarProps) => {
  const menuItems = [
    {
      title: "Veículos",
      icon: Car,
      key: "vehicles"
    },
    {
      title: "Funcionários", 
      icon: Users,
      key: "employees"
    },
    {
      title: "Clientes",
      icon: User,
      key: "customers"
    },
    {
      title: "CRM",
      icon: UserCheck,
      key: "crm"
    },
    {
      title: "Financeiro",
      icon: DollarSign,
      key: "financial"
    },
    {
      title: "Contratos",
      icon: FileText,
      key: "contracts"
    },
    {
      title: "Relatórios",
      icon: BarChart3,
      key: "reports"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Sistema</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton 
                        asChild
                        isActive={activeTab === item.key}
                      >
                        <button
                          onClick={() => onTabChange(item.key)}
                          className="w-full flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-montserrat font-bold">
                Painel Administrativo - Lord Veículos
              </h1>
            </div>
          </div>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminSidebar;
