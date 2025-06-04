
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Phone, Mail } from "lucide-react";
import { Customer, CustomerStatus, CustomerOrigin, Priority } from "@/types/crm";

const ClientsModule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      whatsapp: "(11) 99999-9999",
      cpf: "123.456.789-00",
      birthDate: "1985-03-15",
      address: "Rua das Flores, 123",
      number: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      origin: CustomerOrigin.WEBSITE,
      status: CustomerStatus.HOT_LEAD,
      vehicleInterest: "Civic 2024",
      priceRange: "R$ 80.000 - R$ 100.000",
      financingInterest: true,
      priority: Priority.HIGH,
      assignedEmployee: "Maria Santos",
      lastContact: "2024-01-15",
      nextFollowUp: "2024-01-20",
      observations: "Cliente interessado em Honda Civic. Aguardando aprovação do financiamento.",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Ana Costa",
      email: "ana@email.com",
      phone: "(11) 88888-8888",
      address: "Av. Paulista, 456",
      number: "456",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      origin: CustomerOrigin.REFERRAL,
      status: CustomerStatus.NEGOTIATING,
      vehicleInterest: "Corolla 2024",
      priceRange: "R$ 90.000 - R$ 120.000",
      financingInterest: false,
      priority: Priority.MEDIUM,
      assignedEmployee: "Carlos Lima",
      lastContact: "2024-01-14",
      nextFollowUp: "2024-01-18",
      observations: "Cliente com bom poder de compra. Pagamento à vista.",
      createdAt: "2024-01-08",
      updatedAt: "2024-01-14"
    }
  ]);

  const getStatusColor = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.HOT_LEAD:
        return "bg-red-100 text-red-800";
      case CustomerStatus.NEGOTIATING:
        return "bg-orange-100 text-orange-800";
      case CustomerStatus.PROSPECT:
        return "bg-blue-100 text-blue-800";
      case CustomerStatus.CLIENT:
        return "bg-green-100 text-green-800";
      case CustomerStatus.COLD_LEAD:
        return "bg-gray-100 text-gray-800";
      case CustomerStatus.LOST:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: CustomerStatus) => {
    switch (status) {
      case CustomerStatus.HOT_LEAD:
        return "Lead Quente";
      case CustomerStatus.NEGOTIATING:
        return "Negociando";
      case CustomerStatus.PROSPECT:
        return "Prospect";
      case CustomerStatus.CLIENT:
        return "Cliente";
      case CustomerStatus.COLD_LEAD:
        return "Lead Frio";
      case CustomerStatus.LOST:
        return "Perdido";
      default:
        return status;
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Clientes</h2>
          <p className="text-gray-600">Gerencie seus clientes e leads</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Novo Cliente</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Interesse</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Próximo Contato</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.city}, {customer.state}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(customer.status)}>
                      {getStatusLabel(customer.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-sm">{customer.vehicleInterest}</div>
                      <div className="text-sm text-gray-500">{customer.priceRange}</div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.assignedEmployee}</TableCell>
                  <TableCell>{customer.nextFollowUp}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsModule;
