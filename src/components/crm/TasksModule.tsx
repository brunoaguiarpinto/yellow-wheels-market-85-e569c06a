import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Calendar, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Task, TaskType, TaskStatus, Priority } from "@/types/crm";
import { useToast } from "@/hooks/use-toast";
import TaskForm from "./TaskForm";

const TasksModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

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

  // Mock customers data for the form
  const customers = [
    { id: "1", name: "João Silva" },
    { id: "2", name: "Ana Costa" }
  ];

  const handleNewTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleSubmitTask = (data: any) => {
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...data, updatedAt: new Date().toISOString() }
          : task
      ));
      toast({
        title: "Tarefa atualizada",
        description: "A tarefa foi atualizada com sucesso.",
      });
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now().toString(),
        ...data,
        employeeId: "1",
        employeeName: "Usuário Atual",
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
      toast({
        title: "Tarefa criada",
        description: "Nova tarefa foi adicionada com sucesso.",
      });
    }
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: TaskStatus.COMPLETED, completedAt: new Date().toISOString() }
        : task
    ));
    toast({
      title: "Tarefa concluída",
      description: "A tarefa foi marcada como concluída.",
    });
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };

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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Gestão de Tarefas</h2>
          <p className="text-gray-600 text-sm sm:text-base">Organize e acompanhe suas tarefas diárias</p>
        </div>
        <Button onClick={handleNewTask} className="flex items-center justify-center space-x-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          <span>Nova Tarefa</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              <span>Pendentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{pendingTasks.length}</div>
            <p className="text-xs sm:text-sm text-gray-600">tarefas pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span>Hoje</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{todayTasks.length}</div>
            <p className="text-xs sm:text-sm text-gray-600">tarefas para hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
              <span>Atrasadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600">{overdueTasks.length}</div>
            <p className="text-xs sm:text-sm text-gray-600">tarefas atrasadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span>Concluídas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === TaskStatus.COMPLETED).length}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">tarefas concluídas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4">
            <CardTitle className="text-lg sm:text-xl">Lista de Tarefas</CardTitle>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 sm:h-auto"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "all")}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm h-10 sm:h-auto"
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
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Tarefa</TableHead>
                  <TableHead className="min-w-[100px] hidden sm:table-cell">Tipo</TableHead>
                  <TableHead className="min-w-[100px]">Prioridade</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">Prazo</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Cliente</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Responsável</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[120px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="p-2 sm:p-4">
                      <div>
                        <div className="font-medium text-sm sm:text-base">{task.title}</div>
                        {task.description && (
                          <div className="text-xs sm:text-sm text-gray-500 mt-1">{task.description}</div>
                        )}
                        <div className="sm:hidden mt-2 space-y-1">
                          <Badge className={`${getTypeColor(task.type)} text-xs mr-2`}>
                            {getTypeLabel(task.type)}
                          </Badge>
                          {task.customerName && (
                            <div className="text-xs text-gray-500">Cliente: {task.customerName}</div>
                          )}
                          <div className="text-xs text-gray-500">
                            {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                            {task.dueTime && ` às ${task.dueTime}`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
                      <Badge className={`${getTypeColor(task.type)} text-xs`}>
                        {getTypeLabel(task.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 hidden md:table-cell">
                      <div>
                        <div className="font-medium text-sm">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</div>
                        {task.dueTime && (
                          <div className="text-xs text-gray-500">{task.dueTime}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4 hidden lg:table-cell text-sm">{task.customerName || "-"}</TableCell>
                    <TableCell className="p-2 sm:p-4 hidden lg:table-cell text-sm">{task.employeeName}</TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <Badge className={`${getStatusColor(task.status)} text-xs`}>
                        {getStatusLabel(task.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-2 sm:p-4">
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        {task.status !== TaskStatus.COMPLETED && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 hover:text-green-700 text-xs h-7 px-2"
                            onClick={() => handleCompleteTask(task.id)}
                          >
                            Concluir
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditTask(task)}
                          className="text-xs h-7 px-2"
                        >
                          Editar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredTasks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-gray-500 text-sm">Nenhuma tarefa encontrada</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleSubmitTask}
            onCancel={handleCancel}
            initialData={editingTask || undefined}
            customers={customers}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksModule;
