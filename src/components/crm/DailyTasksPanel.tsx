
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus, Priority, Appointment } from "@/types/crm";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, Phone, Calendar, CheckCircle, AlertCircle } from "lucide-react";

const DailyTasksPanel = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // Carregar tarefas do localStorage
    const savedTasks = JSON.parse(localStorage.getItem('crmTasks') || '[]');
    const savedAppointments = JSON.parse(localStorage.getItem('crmAppointments') || '[]');
    
    const today = new Date().toISOString().split('T')[0];
    
    // Filtrar tarefas do dia atual para o usuário logado
    const todayTasks = savedTasks.filter((task: Task) => 
      task.dueDate === today && 
      task.employeeId === user?.id &&
      task.status !== TaskStatus.COMPLETED
    );

    // Filtrar compromissos do dia atual para o usuário logado
    const todayAppointments = savedAppointments.filter((appointment: Appointment) => 
      appointment.date === today && 
      appointment.employeeId === user?.id &&
      appointment.status !== 'completed'
    );

    setTasks(todayTasks);
    setAppointments(todayAppointments);
  }, [user]);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT: return 'bg-red-500';
      case Priority.HIGH: return 'bg-orange-500';
      case Priority.MEDIUM: return 'bg-yellow-500';
      case Priority.LOW: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT: return 'Urgente';
      case Priority.HIGH: return 'Alta';
      case Priority.MEDIUM: return 'Média';
      case Priority.LOW: return 'Baixa';
      default: return 'Média';
    }
  };

  const completeTask = (taskId: string) => {
    const allTasks = JSON.parse(localStorage.getItem('crmTasks') || '[]');
    const updatedTasks = allTasks.map((task: Task) => 
      task.id === taskId 
        ? { ...task, status: TaskStatus.COMPLETED, completedAt: new Date().toISOString() }
        : task
    );
    localStorage.setItem('crmTasks', JSON.stringify(updatedTasks));
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const overdueCount = tasks.filter(task => {
    const now = new Date();
    const taskTime = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`);
    return taskTime < now;
  }).length;

  return (
    <div className="space-y-4">
      {/* Resumo do Dia */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Tarefas</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Compromissos</p>
                <p className="text-2xl font-bold">{appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Atrasadas</p>
                <p className="text-2xl font-bold text-red-500">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Ligações</p>
                <p className="text-2xl font-bold">
                  {tasks.filter(t => t.type === 'call').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Tarefas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Tarefas de Hoje</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhuma tarefa pendente para hoje! 🎉
              </p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                        {getPriorityText(task.priority)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    {task.customerName && (
                      <p className="text-sm text-blue-600">Cliente: {task.customerName}</p>
                    )}
                    {task.dueTime && (
                      <p className="text-sm text-gray-500">Horário: {task.dueTime}</p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => completeTask(task.id)}
                    className="ml-4"
                  >
                    Concluir
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Compromissos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Compromissos de Hoje</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Nenhum compromisso agendado para hoje.
              </p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{appointment.title}</h4>
                    <p className="text-sm text-gray-600">{appointment.description}</p>
                    <p className="text-sm text-blue-600">Cliente: {appointment.customerName}</p>
                    <p className="text-sm text-gray-500">Horário: {appointment.time}</p>
                  </div>
                  <Badge variant="outline">
                    {appointment.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTasksPanel;
