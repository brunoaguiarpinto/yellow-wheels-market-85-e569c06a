
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSupabaseInsert, useSupabaseUpdate } from "@/hooks/useSupabaseData";

interface SupabaseEmployeeFormProps {
  initialData?: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const SupabaseEmployeeForm = ({ initialData, onSubmit, onCancel }: SupabaseEmployeeFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    document: "",
    role: "salesperson",
    salary: "",
    commission_rate: "",
    hire_date: "",
    address: "",
    is_active: true
  });

  const { insert, loading: inserting } = useSupabaseInsert('employees');
  const { update, loading: updating } = useSupabaseUpdate('employees');

  const isEditing = !!initialData;
  const loading = inserting || updating;

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        document: initialData.document || "",
        role: initialData.role || "salesperson",
        salary: initialData.salary || "",
        commission_rate: initialData.commission_rate || "",
        hire_date: initialData.hire_date || "",
        address: initialData.address || "",
        is_active: initialData.is_active ?? true
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    const submitData = {
      ...formData,
      salary: formData.salary ? parseFloat(formData.salary) : null,
      commission_rate: formData.commission_rate ? parseFloat(formData.commission_rate) : null,
    };

    let success = false;
    
    if (isEditing) {
      const result = await update(initialData.id, submitData);
      success = !!result;
    } else {
      const result = await insert(submitData);
      success = !!result;
    }

    if (success) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="document">CPF</Label>
              <Input
                id="document"
                value={formData.document}
                onChange={(e) => handleChange("document", e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados Profissionais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Cargo</Label>
              <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gerente</SelectItem>
                  <SelectItem value="salesperson">Vendedor</SelectItem>
                  <SelectItem value="mechanic">Mecânico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hire_date">Data de Admissão</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={(e) => handleChange("hire_date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="salary">Salário</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                value={formData.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="commission_rate">Taxa de Comissão (%)</Label>
              <Input
                id="commission_rate"
                type="number"
                step="0.01"
                value={formData.commission_rate}
                onChange={(e) => handleChange("commission_rate", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleChange("is_active", checked)}
              />
              <Label htmlFor="is_active">Funcionário Ativo</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"} Funcionário
        </Button>
      </div>
    </form>
  );
};

export default SupabaseEmployeeForm;
