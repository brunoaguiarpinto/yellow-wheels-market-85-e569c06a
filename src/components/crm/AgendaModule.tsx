
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, User, Car } from "lucide-react";
import { Appointment, AppointmentType, AppointmentStatus } from "@/types/crm";

const AgendaModule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      customerId: "1",
      customerName: "João Silva",
      type: AppointmentType.TEST_DRIVE,
      title: "Test Drive - Honda Civic",
      description: "Test drive agendado para o Honda Civic 2024",
      date: "2024-01-20",
      time: "14:00",
      status: AppointmentStatus.SCHEDULED,
      employeeId: "1",
      employeeName: "Maria Santos",
      reminder: true,
      reminderTime: 30,
      vehicleId: "civic-2024",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      customerId: "2",
      customerName: "Ana Costa",
      type: AppointmentType.MEETING,
      title: "Reunião de Negociação",
      description: "Discussão sobre financiamento e condições de pagamento",
      date: "2024-01-18",
      time: "10:30",
      status: AppointmentStatus.CONFIRMED,
      employeeId: "2",
      employeeName: "Carlos Lima",
      reminder: true,
      reminderTime: 60,
      createdAt: "2024-01-14"
    },
    {
      id: "3",
      customerId: "1",
      customerName: "João Silva",
      type: AppointmentType.CALL_BACK,
      title: "Retorno - Financiamento",
      description: "Ligar para verificar status do financiamento",
      date: "2024-01-22",
      time: "16:00",
      status: AppointmentStatus.SCHEDULED,
      employeeId: "1",
      employeeName: "Maria Santos",
      reminder: false,
      createdAt: "2024-01-16"
    }
  ]);

  const getTypeColor = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.TEST_DRIVE:
        return "bg-blue-100 text-blue-800";
      case AppointmentType.MEETING:
        return "bg-green-100 text-green-800";
      case AppointmentType.CALL_BACK:
        return "bg-orange-100 text-orange-800";
      case AppointmentType.DOCUMENTATION:
        return "bg-purple-100 text-purple-800";
      case AppointmentType.DELIVERY:
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.TEST_DRIVE:
        return "Test Drive";
      case AppointmentType.MEETING:
        return "Reunião";
      case AppointmentType.CALL_BACK:
        return "Retorno";
      case AppointmentType.DOCUMENTATION:
        return "Documentação";
      case AppointmentType.DELIVERY:
        return "Entrega";
      default:
        return "Outros";
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return "bg-yellow-100 text-yellow-800";
      case AppointmentStatus.CONFIRMED:
        return "bg-green-100 text-green-800";
      case AppointmentStatus.COMPLETED:
        return "bg-blue-100 text-blue-800";
      case AppointmentStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      case AppointmentStatus.NO_SHOW:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return "Agendado";
      case AppointmentStatus.CONFIRMED:
        return "Confirmado";
      case AppointmentStatus.COMPLETED:
        return "Concluído";
      case AppointmentStatus.CANCELLED:
        return "Cancelado";
      case AppointmentStatus.NO_SHOW:
        return "Não Compareceu";
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.date === selectedDate
  );

  const todayAppointments = appointments.filter(appointment =>
    appointment.date === new Date().toISOString().split('T')[0]
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Agenda e Compromissos</h2>
          <p className="text-gray-600">Gerencie seus agendamentos e compromissos</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Agendamento</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Hoje</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-sm text-gray-600">compromissos agendados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Próximo</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length > 0 ? (
              <div>
                <div className="font-medium">{todayAppointments[0].time}</div>
                <p className="text-sm text-gray-600">{todayAppointments[0].title}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">Nenhum compromisso hoje</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filtrar por Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Compromissos - {new Date(selectedDate).toLocaleDateString('pt-BR')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{appointment.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(appointment.type)}>
                      {getTypeLabel(appointment.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{appointment.title}</div>
                      {appointment.description && (
                        <div className="text-sm text-gray-500">{appointment.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{appointment.customerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.employeeName}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusLabel(appointment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAppointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-gray-500">Nenhum compromisso agendado para esta data</p>
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

export default AgendaModule;
