
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { useSupabaseData, useSupabaseInsert, useSupabaseUpdate, useSupabaseDelete } from "@/hooks/useSupabaseData";
import SaleForm from "./SaleForm";

const SalesFinancialManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);

  const { data: sales, loading, refetch } = useSupabaseData('sales');
  const { data: customers } = useSupabaseData('customers');
  const { data: vehicles } = useSupabaseData('vehicles');
  const { data: employees } = useSupabaseData('employees');
  const { insert: insertSale } = useSupabaseInsert('sales');
  const { update: updateSale } = useSupabaseUpdate('sales');
  const { deleteRecord: deleteSale } = useSupabaseDelete('sales');

  const filteredSales = sales.filter((sale: any) => {
    const customer = customers.find((c: any) => c.id === sale.customer_id);
    const vehicle = vehicles.find((v: any) => v.id === sale.vehicle_id);
    return (
      customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSaleSubmit = async (data: any) => {
    if (selectedSale) {
      await updateSale(selectedSale.id, data);
    } else {
      await insertSale(data);
    }
    setShowSaleForm(false);
    setSelectedSale(null);
    refetch();
  };

  const handleEditSale = (sale: any) => {
    setSelectedSale(sale);
    setShowSaleForm(true);
  };

  const handleDeleteSale = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      await deleteSale(id);
      refetch();
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c: any) => c.id === customerId);
    return customer?.name || 'N/A';
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find((v: any) => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} ${vehicle.year}` : 'N/A';
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e: any) => e.id === employeeId);
    return employee?.name || 'N/A';
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
          <h3 className="text-xl font-bold">Gestão de Vendas</h3>
          <p className="text-gray-600">Controle financeiro das vendas realizadas</p>
        </div>
        <Button onClick={() => setShowSaleForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nova Venda</span>
        </Button>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por cliente ou veículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total de Vendas</p>
                <p className="text-xl font-bold text-green-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    filteredSales.reduce((sum: number, sale: any) => sum + (Number(sale.sale_price) || 0), 0)
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Quantidade de Vendas</p>
              <p className="text-2xl font-bold">{filteredSales.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Ticket Médio</p>
              <p className="text-xl font-bold">
                {filteredSales.length > 0
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      filteredSales.reduce((sum: number, sale: any) => sum + (Number(sale.sale_price) || 0), 0) / filteredSales.length
                    )
                  : 'R$ 0,00'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Realizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Vendedor</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Financiamento</TableHead>
                  <TableHead>Forma Pgto</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale: any) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      {new Date(sale.sale_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getCustomerName(sale.customer_id)}</TableCell>
                    <TableCell>{getVehicleInfo(sale.vehicle_id)}</TableCell>
                    <TableCell>{getEmployeeName(sale.employee_id)}</TableCell>
                    <TableCell className="font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.sale_price)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.down_payment || 0)}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.financing_amount || 0)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{sale.payment_method}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSale(sale)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSale(sale.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredSales.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhuma venda encontrada.' : 'Nenhuma venda registrada ainda.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showSaleForm && (
        <SaleForm
          initialData={selectedSale}
          onSubmit={handleSaleSubmit}
          onCancel={() => {
            setShowSaleForm(false);
            setSelectedSale(null);
          }}
        />
      )}
    </div>
  );
};

export default SalesFinancialManager;
