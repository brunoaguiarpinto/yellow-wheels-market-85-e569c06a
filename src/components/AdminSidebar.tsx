
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
  ChevronDown,
  ChevronRight 
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

const AdminSidebar = ({ activeTab, onTabChange, children }: AdminSidebarProps) => {
  const [isFinanceiroOpen, setIsFinanceiroOpen] = useState(true);

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
    }
  ];

  const financeiroItems = [
    {
      title: "Financeiro",
      key: "financial"
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

            <Separator className="my-2" />

            <SidebarGroup>
              <Collapsible open={isFinanceiroOpen} onOpenChange={setIsFinanceiroOpen}>
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Financeiro
                    </div>
                    {isFinanceiroOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {financeiroItems.map((item) => (
                        <SidebarMenuItem key={item.key}>
                          <SidebarMenuButton 
                            asChild
                            isActive={activeTab === item.key}
                          >
                            <button
                              onClick={() => onTabChange(item.key)}
                              className="w-full flex items-center gap-2 pl-6"
                            >
                              <span>{item.title}</span>
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
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
