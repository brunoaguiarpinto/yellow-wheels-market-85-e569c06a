
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, User } from "lucide-react";
import { useSupabaseData, useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from "@/hooks/useSupabaseData";
import AppointmentForm from "./AppointmentForm";

const AppointmentCalendar = () => {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: appointments, loading, refetch } = useSupabaseData('appointments');
  const { insert: insertAppointment } = useSupabaseInsert('appointments');
  const { update: updateAppointment } = useSupabaseUpdate('appointments');
  const { deleteRecord: deleteAppointment } = useSupabaseDelete('appointments');

  const today = new Date();
  const currentWeek = [];
  
  // Gerar semana atual
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    currentWeek.push(date);
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter((apt: any) => 
      apt.start_time?.split('T')[0] === dateStr
    );
  };

  const handleAppointmentSubmit = async (data: any) => {
    if (selectedAppointment) {
      await updateAppointment(selectedAppointment.id, data);
    } else {
      await insertAppointment(data);
    }
    setShowAppointmentForm(false);
    setSelectedAppointment(null);
    refetch();
  };

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowAppointmentForm(true);
  };

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este compromisso?')) {
      await deleteAppointment(id);
      refetch();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">Agenda de Compromissos</h3>
          <p className="text-gray-600">Gerencie seus compromissos e reuniões</p>
        </div>
        <Button onClick={() => setShowAppointmentForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Compromisso</span>
        </Button>
      </div>

      {/* Calendário Semanal */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {currentWeek.map((date, index) => {
          const dayAppointments = getAppointmentsForDate(date);
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <Card key={index} className={`${isToday ? 'ring-2 ring-accent' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-center">
                  <div className="text-sm text-gray-600">
                    {date.toLocaleDateString('pt-BR', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg ${isToday ? 'text-accent font-bold' : ''}`}>
                    {date.getDate()}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayAppointments.map((appointment: any) => (
                  <div
                    key={appointment.id}
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => handleEditAppointment(appointment)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(appointment.start_time).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    <div className="text-sm font-medium truncate">
                      {appointment.title}
                    </div>
                    {appointment.description && (
                      <div className="text-xs text-gray-600 truncate">
                        {appointment.description}
                      </div>
                    )}
                  </div>
                ))}
                {dayAppointments.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-4">
                    Nenhum compromisso
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lista de Próximos Compromissos */}
      <Card>
        <CardHeader>
          <CardTitle>Próximos Compromissos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {appointments
              .filter((apt: any) => new Date(apt.start_time) >= today)
              .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
              .slice(0, 5)
              .map((appointment: any) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{appointment.title}</h4>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(appointment.start_time).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(appointment.start_time).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAppointment(appointment)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            {appointments.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                Nenhum compromisso agendado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showAppointmentForm && (
        <AppointmentForm
          initialData={selectedAppointment}
          onSubmit={handleAppointmentSubmit}
          onCancel={() => {
            setShowAppointmentForm(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </div>
  );
};

export default AppointmentCalendar;
