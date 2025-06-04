
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Calendar, Clock } from "lucide-react";
import { Appointment, AppointmentType, AppointmentStatus } from "@/types/crm";
import { useToast } from "@/hooks/use-toast";
import AppointmentForm from "./AppointmentForm";

const AgendaModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      customerId: "1",
      customerName: "João Silva",
      type: AppointmentType.TEST_DRIVE,
      title: "Test Drive - Honda Civic",
      description: "Cliente quer testar o modelo 2024",
      date: "2024-01-20",
      time: "14:00",
      status: AppointmentStatus.SCHEDULED,
      employeeId: "1",
      employeeName: "Maria Santos",
      reminder: true,
      reminderTime: 30,
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      customerId: "2",
      customerName: "Ana Costa",
      type: AppointmentType.MEETING,
      title: "Reunião de Negociação",
      description: "Discussão sobre financiamento",
      date: "2024-01-18",
      time: "10:00",
      status: AppointmentStatus.CONFIRMED,
      employeeId: "2",
      employeeName: "Carlos Lima",
      reminder: true,
      reminderTime: 60,
      createdAt: "2024-01-14"
    }
  ]);

  // Mock customers data for the form
  const customers = [
    { id: "1", name: "João Silva" },
    { id: "2", name: "Ana Costa" }
  ];

  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setIsDialogOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleSubmitAppointment = (data: any) => {
    if (editingAppointment) {
      setAppointments(prev => prev.map(appointment => 
        appointment.id === editingAppointment.id 
          ? { ...appointment, ...data, updatedAt: new Date().toISOString() }
          : appointment
      ));
      toast({
        title: "Agendamento atualizado",
        description: "O agendamento foi atualizado com sucesso.",
      });
    } else {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        ...data,
        employeeId: "1",
        employeeName: "Usuário Atual",
        createdAt: new Date().toISOString(),
      };
      setAppointments(prev => [...prev, newAppointment]);
      toast({
        title: "Agendamento criado",
        description: "Novo agendamento foi criado com sucesso.",
      });
    }
    setIsDialogOpen(false);
    setEditingAppointment(null);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingAppointment(null);
  };

  const getTypeLabel = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.TEST_DRIVE: return "Test Drive";
      case AppointmentType.MEETING: return "Reunião";
      case AppointmentType.CALL_BACK: return "Retorno de Ligação";
      case AppointmentType.DOCUMENTATION: return "Documentação";
      case AppointmentType.DELIVERY: return "Entrega";
      default: return "Outros";
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED: return "bg-blue-100 text-blue-800";
      case AppointmentStatus.CONFIRMED: return "bg-green-100 text-green-800";
      case AppointmentStatus.COMPLETED: return "bg-gray-100 text-gray-800";
      case AppointmentStatus.CANCELLED: return "bg-red-100 text-red-800";
      case AppointmentStatus.NO_SHOW: return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED: return "Agendado";
      case AppointmentStatus.CONFIRMED: return "Confirmado";
      case AppointmentStatus.COMPLETED: return "Concluído";
      case AppointmentStatus.CANCELLED: return "Cancelado";
      case AppointmentStatus.NO_SHOW: return "Não Compareceu";
      default: return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const todayAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
  const upcomingAppointments = appointments.filter(apt => new Date(apt.date) > new Date());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Agenda</h2>
          <p className="text-gray-600">Gerencie seus agendamentos e compromissos</p>
        </div>
        <Button onClick={handleNewAppointment} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Agendamento</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Hoje</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-sm text-gray-600">agendamentos hoje</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span>Próximos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-sm text-gray-600">agendamentos futuros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>Total</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
            <p className="text-sm text-gray-600">total de agendamentos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Lista de Agendamentos</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar agendamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agendamento</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data e Hora</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.title}</div>
                      {appointment.description && (
                        <div className="text-sm text-gray-500">{appointment.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{appointment.customerName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTypeLabel(appointment.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{new Date(appointment.date).toLocaleDateString('pt-BR')}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.employeeName}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditAppointment(appointment)}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-gray-500">Nenhum agendamento encontrado</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
            </DialogTitle>
          </DialogHeader>
          <AppointmentForm
            onSubmit={handleSubmitAppointment}
            onCancel={handleCancel}
            initialData={editingAppointment || undefined}
            customers={customers}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgendaModule;
