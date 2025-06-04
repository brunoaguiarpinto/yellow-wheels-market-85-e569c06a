
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Task, TaskType, TaskStatus, Priority } from "@/types/crm";

const TasksModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Ligar para João Silva",
      description: "Verificar status do financiamento e agendar próxima reunião",
      type: TaskType.CALL,
      priority: Priority.HIGH,
      dueDate: "2024-01-20",
      dueTime: "14:00",
      status: TaskStatus.PENDING,
      customerId: "1",
      customerName: "João Silva",
      employeeId: "1",
      employeeName: "Maria Santos",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      title: "Enviar proposta por email",
      description: "Enviar proposta detalhada para Ana Costa com condições especiais",
      type: TaskType.EMAIL,
      priority: Priority.MEDIUM,
      dueDate: "2024-01-18",
      dueTime: "10:00",
      status: TaskStatus.IN_PROGRESS,
      customerId: "2",
      customerName: "Ana Costa",
      employeeId: "2",
      employeeName: "Carlos Lima",
      createdAt: "2024-01-14"
    },
    {
      id: "3",
      title: "Preparar documentação",
      description: "Preparar toda documentação necessária para venda do Civic",
      type: TaskType.DOCUMENTATION,
      priority: Priority.HIGH,
      dueDate: "2024-01-22",
      status: TaskStatus.PENDING,
      customerId: "1",
      customerName: "João Silva",
      employeeId: "1",
      employeeName: "Maria Santos",
      createdAt: "2024-01-16"
    },
    {
      id: "4",
      title: "Follow-up com cliente perdido",
      description: "Tentar reativar cliente que não finalizou compra",
      type: TaskType.FOLLOW_UP,
      priority: Priority.LOW,
      dueDate: "2024-01-19",
      status: TaskStatus.COMPLETED,
      employeeId: "2",
      employeeName: "Carlos Lima",
      createdAt: "2024-01-12",
      completedAt: "2024-01-17"
    }
  ]);

  const getTypeColor = (type: TaskType) => {
    switch (type) {
      case TaskType.CALL:
        return "bg-blue-100 text-blue-800";
      case TaskType.EMAIL:
        return "bg-green-100 text-green-800";
      case TaskType.FOLLOW_UP:
        return "bg-orange-100 text-orange-800";
      case TaskType.DOCUMENTATION:
        return "bg-purple-100 text-purple-800";
      case TaskType.PREPARATION:
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: TaskType) => {
    switch (type) {
      case TaskType.CALL:
        return "Ligação";
      case TaskType.EMAIL:
        return "Email";
      case TaskType.FOLLOW_UP:
        return "Follow-up";
      case TaskType.DOCUMENTATION:
        return "Documentação";
      case TaskType.PREPARATION:
        return "Preparação";
      default:
        return "Outros";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case TaskStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case TaskStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return "Pendente";
      case TaskStatus.IN_PROGRESS:
        return "Em Andamento";
      case TaskStatus.COMPLETED:
        return "Concluída";
      case TaskStatus.CANCELLED:
        return "Cancelada";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return "bg-red-100 text-red-800";
      case Priority.HIGH:
        return "bg-orange-100 text-orange-800";
      case Priority.MEDIUM:
        return "bg-yellow-100 text-yellow-800";
      case Priority.LOW:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return "Urgente";
      case Priority.HIGH:
        return "Alta";
      case Priority.MEDIUM:
        return "Média";
      case Priority.LOW:
        return "Baixa";
      default:
        return priority;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const pendingTasks = tasks.filter(task => task.status === TaskStatus.PENDING);
  const todayTasks = tasks.filter(task => task.dueDate === new Date().toISOString().split('T')[0]);
  const overdueTasks = tasks.filter(task => 
    task.status !== TaskStatus.COMPLETED && 
    new Date(task.dueDate) < new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Tarefas</h2>
          <p className="text-gray-600">Organize e acompanhe suas tarefas diárias</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Tarefa</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span>Pendentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-sm text-gray-600">tarefas pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Hoje</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayTasks.length}</div>
            <p className="text-sm text-gray-600">tarefas para hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>Atrasadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
            <p className="text-sm text-gray-600">tarefas atrasadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Concluídas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === TaskStatus.COMPLETED).length}
            </div>
            <p className="text-sm text-gray-600">tarefas concluídas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Lista de Tarefas</CardTitle>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "all")}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value={TaskStatus.PENDING}>Pendente</option>
                <option value={TaskStatus.IN_PROGRESS}>Em Andamento</option>
                <option value={TaskStatus.COMPLETED}>Concluída</option>
                <option value={TaskStatus.CANCELLED}>Cancelada</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarefa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-500">{task.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(task.type)}>
                      {getTypeLabel(task.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</div>
                      {task.dueTime && (
                        <div className="text-sm text-gray-500">{task.dueTime}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{task.customerName || "-"}</TableCell>
                  <TableCell>{task.employeeName}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusLabel(task.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {task.status !== TaskStatus.COMPLETED && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                        >
                          Concluir
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-gray-500">Nenhuma tarefa encontrada</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksModule;
