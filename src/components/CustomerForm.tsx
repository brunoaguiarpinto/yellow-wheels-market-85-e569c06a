
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const customerSchema = z.object({
  // Dados Pessoais
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().min(11, "CPF é obrigatório"),
  rg: z.string().optional(),
  birthDate: z.string().optional(),
  
  // Contato
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone é obrigatório"),
  whatsapp: z.string().optional(),
  
  // Endereço
  address: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zipCode: z.string().min(8, "CEP é obrigatório"),
  
  // Preferências
  vehicleInterest: z.string().optional(),
  priceRange: z.string().optional(),
  financingInterest: z.boolean().optional(),
  
  // Observações
  observations: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  onSubmit?: (data: CustomerFormData) => void;
  onCancel?: () => void;
}

const CustomerForm = ({ onSubmit, onCancel }: CustomerFormProps) => {
  const { toast } = useToast();
  
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      financingInterest: false,
    }
  });

  const handleSubmit = (data: CustomerFormData) => {
    onSubmit?.(data);
    toast({
      title: "Cliente cadastrado!",
      description: "O cliente foi adicionado com sucesso.",
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Dados Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Dados Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="font-opensans">Nome Completo *</Label>
              <Input 
                id="name" 
                {...form.register("name")}
                placeholder="Ex: João Silva" 
                className="font-opensans" 
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="cpf" className="font-opensans">CPF *</Label>
              <Input 
                id="cpf" 
                {...form.register("cpf")}
                placeholder="000.000.000-00" 
                className="font-opensans" 
              />
              {form.formState.errors.cpf && (
                <p className="text-red-500 text-sm">{form.formState.errors.cpf.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rg" className="font-opensans">RG</Label>
              <Input 
                id="rg" 
                {...form.register("rg")}
                placeholder="00.000.000-0" 
                className="font-opensans" 
              />
            </div>
            <div>
              <Label htmlFor="birthDate" className="font-opensans">Data de Nascimento</Label>
              <Input 
                id="birthDate" 
                type="date"
                {...form.register("birthDate")}
                className="font-opensans" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="font-opensans">Email *</Label>
              <Input 
                id="email" 
                type="email"
                {...form.register("email")}
                placeholder="joao@email.com" 
                className="font-opensans" 
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone" className="font-opensans">Telefone *</Label>
              <Input 
                id="phone" 
                {...form.register("phone")}
                placeholder="(11) 99999-9999" 
                className="font-opensans" 
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm">{form.formState.errors.phone.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="whatsapp" className="font-opensans">WhatsApp</Label>
            <Input 
              id="whatsapp" 
              {...form.register("whatsapp")}
              placeholder="(11) 99999-9999" 
              className="font-opensans" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Endereço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="address" className="font-opensans">Endereço *</Label>
              <Input 
                id="address" 
                {...form.register("address")}
                placeholder="Rua das Flores" 
                className="font-opensans" 
              />
              {form.formState.errors.address && (
                <p className="text-red-500 text-sm">{form.formState.errors.address.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="number" className="font-opensans">Número *</Label>
              <Input 
                id="number" 
                {...form.register("number")}
                placeholder="123" 
                className="font-opensans" 
              />
              {form.formState.errors.number && (
                <p className="text-red-500 text-sm">{form.formState.errors.number.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="complement" className="font-opensans">Complemento</Label>
              <Input 
                id="complement" 
                {...form.register("complement")}
                placeholder="Apt 101" 
                className="font-opensans" 
              />
            </div>
            <div>
              <Label htmlFor="neighborhood" className="font-opensans">Bairro *</Label>
              <Input 
                id="neighborhood" 
                {...form.register("neighborhood")}
                placeholder="Centro" 
                className="font-opensans" 
              />
              {form.formState.errors.neighborhood && (
                <p className="text-red-500 text-sm">{form.formState.errors.neighborhood.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="font-opensans">Cidade *</Label>
              <Input 
                id="city" 
                {...form.register("city")}
                placeholder="São Paulo" 
                className="font-opensans" 
              />
              {form.formState.errors.city && (
                <p className="text-red-500 text-sm">{form.formState.errors.city.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="state" className="font-opensans">Estado *</Label>
              <Select onValueChange={(value) => form.setValue("state", value)}>
                <SelectTrigger className="font-opensans">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">São Paulo</SelectItem>
                  <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                  <SelectItem value="MG">Minas Gerais</SelectItem>
                  <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                  <SelectItem value="PR">Paraná</SelectItem>
                  <SelectItem value="SC">Santa Catarina</SelectItem>
                  <SelectItem value="BA">Bahia</SelectItem>
                  <SelectItem value="GO">Goiás</SelectItem>
                  <SelectItem value="PE">Pernambuco</SelectItem>
                  <SelectItem value="CE">Ceará</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.state && (
                <p className="text-red-500 text-sm">{form.formState.errors.state.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="zipCode" className="font-opensans">CEP *</Label>
              <Input 
                id="zipCode" 
                {...form.register("zipCode")}
                placeholder="00000-000" 
                className="font-opensans" 
              />
              {form.formState.errors.zipCode && (
                <p className="text-red-500 text-sm">{form.formState.errors.zipCode.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferências */}
      <Card>
        <CardHeader>
          <CardTitle className="font-montserrat">Preferências e Interesses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicleInterest" className="font-opensans">Interesse em Veículo</Label>
              <Select onValueChange={(value) => form.setValue("vehicleInterest", value)}>
                <SelectTrigger className="font-opensans">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Sedan</SelectItem>
                  <SelectItem value="hatch">Hatchback</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="coupe">Cupê</SelectItem>
                  <SelectItem value="any">Qualquer tipo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priceRange" className="font-opensans">Faixa de Preço</Label>
              <Select onValueChange={(value) => form.setValue("priceRange", value)}>
                <SelectTrigger className="font-opensans">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-30000">Até R$ 30.000</SelectItem>
                  <SelectItem value="30000-50000">R$ 30.000 - R$ 50.000</SelectItem>
                  <SelectItem value="50000-80000">R$ 50.000 - R$ 80.000</SelectItem>
                  <SelectItem value="80000-120000">R$ 80.000 - R$ 120.000</SelectItem>
                  <SelectItem value="120000+">Acima de R$ 120.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="observations" className="font-opensans">Observações</Label>
            <Textarea 
              id="observations" 
              {...form.register("observations")}
              placeholder="Informações adicionais sobre o cliente, preferências específicas, histórico de compras, etc..." 
              className="font-opensans" 
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

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
          Salvar Cliente
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
