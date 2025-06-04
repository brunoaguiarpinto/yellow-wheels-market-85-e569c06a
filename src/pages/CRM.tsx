
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import DailyTasksPanel from "@/components/crm/DailyTasksPanel";
import { Users, Calendar, CheckSquare, BarChart3 } from "lucide-react";

const CRM = () => {
  const { user } = useAuth();
  const { canViewClients } = usePermissions();

  if (!canViewClients) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
            <p className="text-gray-600">
              Você não tem permissão para acessar o módulo CRM.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-montserrat font-bold">CRM - Customer Relationship Management</h1>
        <p className="text-gray-600 font-opensans">
          Gerencie seus clientes, compromissos e tarefas de forma eficiente
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="agenda" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Agenda</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center space-x-2">
            <CheckSquare className="h-4 w-4" />
            <span>Tarefas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <DailyTasksPanel />
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Módulo de clientes em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agenda">
          <Card>
            <CardHeader>
              <CardTitle>Agenda e Compromissos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Módulo de agenda em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Módulo de tarefas em desenvolvimento...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRM;
