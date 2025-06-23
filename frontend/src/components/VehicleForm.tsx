import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";

const vehicleSchema = z.object({
  // Dados Básicos
  brand: z.string().min(1, "Marca é obrigatória"),
  model: z.string().min(1, "Modelo é obrigatório"),
  version: z.string().optional(),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().min(1, "Preço é obrigatório"),
  
  // Especificações
  mileage: z.number().min(0),
  fuel: z.string().min(1, "Combustível é obrigatório"),
  transmission: z.string().min(1, "Transmissão é obrigatória"),
  engine: z.string().optional(),
  power: z.string().optional(),
  
  // Características
  doors: z.number().min(2).max(5),
  seats: z.number().min(2).max(9),
  color: z.string().min(1, "Cor é obrigatória"),
  bodyType: z.string().min(1, "Tipo de carroceria é obrigatório"),
  
  // Documentação
  chassisNumber: z.string().optional(),
  licensePlate: z.string().optional(),
  renavam: z.string().optional(),
  
  // Descrição
  description: z.string().optional(),
  observations: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleFormProps {
  onSubmit?: (data: VehicleFormData & { images: File[] }) => void;
  onCancel?: () => void;
}

const VehicleForm = ({ onSubmit, onCancel }: VehicleFormProps) => {
  const [images, setImages] = useState<File[]>([]);
  const { toast } = useToast();
  
  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      doors: 4,
      seats: 5,
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 10)); // Limite de 10 imagens
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (data: VehicleFormData) => {
    onSubmit?.({ ...data, images });
    toast({
      title: "Veículo cadastrado!",
      description: "O veículo foi adicionado ao estoque com sucesso.",
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="font-opensans">Dados Básicos</TabsTrigger>
          <TabsTrigger value="specs" className="font-opensans">Especificações</TabsTrigger>
          <TabsTrigger value="features" className="font-opensans">Características</TabsTrigger>
          <TabsTrigger value="docs" className="font-opensans">Documentação</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Dados Básicos do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand" className="font-opensans">Marca *</Label>
                  <Input 
                    id="brand" 
                    {...form.register("brand")}
                    placeholder="Ex: Toyota" 
                    className="font-opensans" 
                  />
                  {form.formState.errors.brand && (
                    <p className="text-red-500 text-sm">{form.formState.errors.brand.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="model" className="font-opensans">Modelo *</Label>
                  <Input 
                    id="model" 
                    {...form.register("model")}
                    placeholder="Ex: Corolla" 
                    className="font-opensans" 
                  />
                  {form.formState.errors.model && (
                    <p className="text-red-500 text-sm">{form.formState.errors.model.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="version" className="font-opensans">Versão</Label>
                  <Input 
                    id="version" 
                    {...form.register("version")}
                    placeholder="Ex: XEi" 
                    className="font-opensans" 
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="font-opensans">Ano *</Label>
                  <Input 
                    id="year" 
                    type="number" 
                    {...form.register("year", { valueAsNumber: true })}
                    placeholder="2023" 
                    className="font-opensans" 
                  />
                  {form.formState.errors.year && (
                    <p className="text-red-500 text-sm">{form.formState.errors.year.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="price" className="font-opensans">Preço (R$) *</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    {...form.register("price", { valueAsNumber: true })}
                    placeholder="89000" 
                    className="font-opensans" 
                  />
                  {form.formState.errors.price && (
                    <p className="text-red-500 text-sm">{form.formState.errors.price.message}</p>
                  )}
                </div>
              </div>

              {/* Upload de Imagens */}
              <div>
                <Label className="font-opensans">Fotos do Veículo</Label>
                <div className="mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500 font-opensans">
                        <span className="font-semibold">Clique para adicionar fotos</span>
                      </p>
                      <p className="text-xs text-gray-500 font-opensans">PNG, JPG até 10MB (máx. 10 fotos)</p>
                    </div>
                    <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt={`Preview ${index}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Especificações Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mileage" className="font-opensans">Quilometragem *</Label>
                  <Input 
                    id="mileage" 
                    type="number" 
                    {...form.register("mileage", { valueAsNumber: true })}
                    placeholder="15000" 
                    className="font-opensans" 
                  />
                </div>
                <div>
                  <Label htmlFor="fuel" className="font-opensans">Combustível *</Label>
                  <Select onValueChange={(value) => form.setValue("fuel", value)}>
                    <SelectTrigger className="font-opensans">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flex">Flex</SelectItem>
                      <SelectItem value="gasoline">Gasolina</SelectItem>
                      <SelectItem value="ethanol">Etanol</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="electric">Elétrico</SelectItem>
                      <SelectItem value="hybrid">Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transmission" className="font-opensans">Transmissão *</Label>
                  <Select onValueChange={(value) => form.setValue("transmission", value)}>
                    <SelectTrigger className="font-opensans">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="automatic">Automática</SelectItem>
                      <SelectItem value="cvt">CVT</SelectItem>
                      <SelectItem value="automated">Automatizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="engine" className="font-opensans">Motor</Label>
                  <Input 
                    id="engine" 
                    {...form.register("engine")}
                    placeholder="Ex: 2.0 16V" 
                    className="font-opensans" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="power" className="font-opensans">Potência</Label>
                <Input 
                  id="power" 
                  {...form.register("power")}
                  placeholder="Ex: 150 cv" 
                  className="font-opensans" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Características</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="doors" className="font-opensans">Portas *</Label>
                  <Select onValueChange={(value) => form.setValue("doors", parseInt(value))}>
                    <SelectTrigger className="font-opensans">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 portas</SelectItem>
                      <SelectItem value="3">3 portas</SelectItem>
                      <SelectItem value="4">4 portas</SelectItem>
                      <SelectItem value="5">5 portas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="seats" className="font-opensans">Lugares *</Label>
                  <Select onValueChange={(value) => form.setValue("seats", parseInt(value))}>
                    <SelectTrigger className="font-opensans">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 lugares</SelectItem>
                      <SelectItem value="4">4 lugares</SelectItem>
                      <SelectItem value="5">5 lugares</SelectItem>
                      <SelectItem value="7">7 lugares</SelectItem>
                      <SelectItem value="9">9 lugares</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="color" className="font-opensans">Cor *</Label>
                  <Input 
                    id="color" 
                    {...form.register("color")}
                    placeholder="Ex: Branco" 
                    className="font-opensans" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bodyType" className="font-opensans">Tipo de Carroceria *</Label>
                <Select onValueChange={(value) => form.setValue("bodyType", value)}>
                  <SelectTrigger className="font-opensans">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="hatch">Hatchback</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="pickup">Pickup</SelectItem>
                    <SelectItem value="coupe">Cupê</SelectItem>
                    <SelectItem value="convertible">Conversível</SelectItem>
                    <SelectItem value="wagon">SW/Wagon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat">Documentação e Observações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="chassisNumber" className="font-opensans">Número do Chassi</Label>
                  <Input 
                    id="chassisNumber" 
                    {...form.register("chassisNumber")}
                    placeholder="Ex: 9BD..." 
                    className="font-opensans" 
                  />
                </div>
                <div>
                  <Label htmlFor="licensePlate" className="font-opensans">Placa</Label>
                  <Input 
                    id="licensePlate" 
                    {...form.register("licensePlate")}
                    placeholder="Ex: ABC-1234" 
                    className="font-opensans" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="renavam" className="font-opensans">RENAVAM</Label>
                <Input 
                  id="renavam" 
                  {...form.register("renavam")}
                  placeholder="Ex: 123456789" 
                  className="font-opensans" 
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="font-opensans">Descrição</Label>
                <Textarea 
                  id="description" 
                  {...form.register("description")}
                  placeholder="Descreva as principais características e diferenciais do veículo..." 
                  className="font-opensans" 
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="observations" className="font-opensans">Observações</Label>
                <Textarea 
                  id="observations" 
                  {...form.register("observations")}
                  placeholder="Informações adicionais, histórico de manutenção, etc..." 
                  className="font-opensans" 
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="font-opensans"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          className="bg-accent text-black hover:bg-accent/90 font-opensans font-semibold"
        >
          Salvar Veículo
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;
