
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import DailyTasksPanel from "@/components/crm/DailyTasksPanel";
import ClientsModule from "@/components/crm/ClientsModule";
import AgendaModule from "@/components/crm/AgendaModule";
import TasksModule from "@/components/crm/TasksModule";
import { Users, Calendar, CheckSquare, BarChart3 } from "lucide-react";

const CRM = () => {
  const { user } = useAuth();
  const { canViewClients } = usePermissions();

  if (!canViewClients) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-4 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Acesso Negado</h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Você não tem permissão para acessar o módulo CRM.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-montserrat font-bold leading-tight">
          CRM - Customer Relationship Management
        </h1>
        <p className="text-gray-600 font-opensans text-sm sm:text-base mt-1 sm:mt-2">
          Gerencie seus clientes, compromissos e tarefas de forma eficiente
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-10 p-1">
          <TabsTrigger value="dashboard" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1.5 px-2 sm:px-3 text-xs sm:text-sm">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="leading-none">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1.5 px-2 sm:px-3 text-xs sm:text-sm">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="leading-none">Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="agenda" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1.5 px-2 sm:px-3 text-xs sm:text-sm">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="leading-none">Agenda</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 py-2 sm:py-1.5 px-2 sm:px-3 text-xs sm:text-sm">
            <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="leading-none">Tarefas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-4 sm:mt-6">
          <DailyTasksPanel />
        </TabsContent>

        <TabsContent value="clients" className="mt-4 sm:mt-6">
          <ClientsModule />
        </TabsContent>

        <TabsContent value="agenda" className="mt-4 sm:mt-6">
          <AgendaModule />
        </TabsContent>

        <TabsContent value="tasks" className="mt-4 sm:mt-6">
          <TasksModule />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRM;
