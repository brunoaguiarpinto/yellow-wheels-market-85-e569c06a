
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { Lock, Users, Calendar, CheckSquare, Wrench, MessageSquare } from "lucide-react";
import ClientsModule from "@/components/crm/ClientsModule";
import AgendaModule from "@/components/crm/AgendaModule";
import TasksModule from "@/components/crm/TasksModule";
import PostSalesManager from "@/components/crm/PostSalesManager";
import NegotiationHistory from "@/components/crm/NegotiationHistory";

const CRM = () => {
  const { user, isAuthenticated } = useAuth();
  const { canViewCRM } = usePermissions();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Lock className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Acesso Restrito</h3>
            <p className="text-gray-600">Você precisa estar logado para acessar esta área.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!canViewCRM) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Lock className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Acesso Negado</h3>
            <p className="text-gray-600">
              Você não tem permissão para acessar o módulo CRM.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">CRM - Gestão de Relacionamento</h2>
        <p className="text-gray-600">Gestão completa de clientes e relacionamento comercial</p>
      </div>

      <Tabs defaultValue="clients" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
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
          <TabsTrigger value="post-sales" className="flex items-center space-x-2">
            <Wrench className="h-4 w-4" />
            <span>Pós-Venda</span>
          </TabsTrigger>
          <TabsTrigger value="negotiations" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Negociações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <ClientsModule onCustomerSelect={setSelectedCustomerId} />
        </TabsContent>

        <TabsContent value="agenda">
          <AgendaModule />
        </TabsContent>

        <TabsContent value="tasks">
          <TasksModule />
        </TabsContent>

        <TabsContent value="post-sales">
          <PostSalesManager />
        </TabsContent>

        <TabsContent value="negotiations">
          {selectedCustomerId ? (
            <NegotiationHistory customerId={selectedCustomerId} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Selecione um cliente na aba "Clientes" para ver o histórico.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRM;
