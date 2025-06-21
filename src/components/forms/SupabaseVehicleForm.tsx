
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseInsert, useSupabaseUpdate } from "@/hooks/useSupabaseData";

interface SupabaseVehicleFormProps {
  initialData?: any;
  onSubmit: () => void;
  onCancel: () => void;
}

const SupabaseVehicleForm = ({ initialData, onSubmit, onCancel }: SupabaseVehicleFormProps) => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    fuel: "",
    transmission: "",
    color: "",
    plate: "",
    chassis: "",
    description: "",
    status: "available",
    purchase_price: "",
    purchase_date: "",
    supplier: "",
    condition: ""
  });

  const { insert, loading: inserting } = useSupabaseInsert('vehicles');
  const { update, loading: updating } = useSupabaseUpdate('vehicles');

  const isEditing = !!initialData;
  const loading = inserting || updating;

  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand || "",
        model: initialData.model || "",
        year: initialData.year?.toString() || "",
        price: initialData.price?.toString() || "",
        mileage: initialData.mileage?.toString() || "",
        fuel: initialData.fuel || "",
        transmission: initialData.transmission || "",
        color: initialData.color || "",
        plate: initialData.plate || "",
        chassis: initialData.chassis || "",
        description: initialData.description || "",
        status: initialData.status || "available",
        purchase_price: initialData.purchase_price?.toString() || "",
        purchase_date: initialData.purchase_date || "",
        supplier: initialData.supplier || "",
        condition: initialData.condition || ""
      });
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.brand.trim() || !formData.model.trim() || !formData.year || !formData.price) {
      return;
    }

    const submitData = {
      ...formData,
      year: parseInt(formData.year),
      price: parseFloat(formData.price),
      mileage: formData.mileage ? parseInt(formData.mileage) : 0,
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
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
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="brand">Marca *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="model">Modelo *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Ano *</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max="2030"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="color">Cor *</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleChange("color", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="fuel">Combustível *</Label>
              <Select value={formData.fuel} onValueChange={(value) => handleChange("fuel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gasolina">Gasolina</SelectItem>
                  <SelectItem value="Álcool">Álcool</SelectItem>
                  <SelectItem value="Flex">Flex</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="Elétrico">Elétrico</SelectItem>
                  <SelectItem value="Híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="transmission">Câmbio *</Label>
              <Select value={formData.transmission} onValueChange={(value) => handleChange("transmission", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automático">Automático</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes Técnicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="plate">Placa</Label>
              <Input
                id="plate"
                value={formData.plate}
                onChange={(e) => handleChange("plate", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="chassis">Chassi</Label>
              <Input
                id="chassis"
                value={formData.chassis}
                onChange={(e) => handleChange("chassis", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="mileage">Quilometragem</Label>
              <Input
                id="mileage"
                type="number"
                min="0"
                value={formData.mileage}
                onChange={(e) => handleChange("mileage", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações Comerciais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço de Venda *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="reserved">Reservado</SelectItem>
                  <SelectItem value="sold">Vendido</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="purchase_price">Preço de Compra</Label>
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.purchase_price}
                onChange={(e) => handleChange("purchase_price", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="purchase_date">Data de Compra</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => handleChange("purchase_date", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleChange("supplier", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="condition">Condição</Label>
              <Select value={formData.condition} onValueChange={(value) => handleChange("condition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excelente</SelectItem>
                  <SelectItem value="good">Bom</SelectItem>
                  <SelectItem value="fair">Regular</SelectItem>
                  <SelectItem value="poor">Ruim</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"} Veículo
        </Button>
      </div>
    </form>
  );
};

export default SupabaseVehicleForm;
