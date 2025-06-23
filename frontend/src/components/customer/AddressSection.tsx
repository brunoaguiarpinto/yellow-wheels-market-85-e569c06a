
import { UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddressSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
}

const AddressSection = ({ register, setValue, errors }: AddressSectionProps) => {
  return (
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
              {...register("address")}
              placeholder="Rua das Flores" 
              className="font-opensans" 
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{String(errors.address.message || "Campo obrigatório")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="number" className="font-opensans">Número *</Label>
            <Input 
              id="number" 
              {...register("number")}
              placeholder="123" 
              className="font-opensans" 
            />
            {errors.number && (
              <p className="text-red-500 text-sm">{String(errors.number.message || "Campo obrigatório")}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="complement" className="font-opensans">Complemento</Label>
            <Input 
              id="complement" 
              {...register("complement")}
              placeholder="Apt 101" 
              className="font-opensans" 
            />
          </div>
          <div>
            <Label htmlFor="neighborhood" className="font-opensans">Bairro *</Label>
            <Input 
              id="neighborhood" 
              {...register("neighborhood")}
              placeholder="Centro" 
              className="font-opensans" 
            />
            {errors.neighborhood && (
              <p className="text-red-500 text-sm">{String(errors.neighborhood.message || "Campo obrigatório")}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city" className="font-opensans">Cidade *</Label>
            <Input 
              id="city" 
              {...register("city")}
              placeholder="São Paulo" 
              className="font-opensans" 
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{String(errors.city.message || "Campo obrigatório")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="state" className="font-opensans">Estado *</Label>
            <Select onValueChange={(value) => setValue("state", value)}>
              <SelectTrigger className="font-opensans">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AC">Acre</SelectItem>
                <SelectItem value="AL">Alagoas</SelectItem>
                <SelectItem value="AP">Amapá</SelectItem>
                <SelectItem value="AM">Amazonas</SelectItem>
                <SelectItem value="BA">Bahia</SelectItem>
                <SelectItem value="CE">Ceará</SelectItem>
                <SelectItem value="DF">Distrito Federal</SelectItem>
                <SelectItem value="ES">Espírito Santo</SelectItem>
                <SelectItem value="GO">Goiás</SelectItem>
                <SelectItem value="MA">Maranhão</SelectItem>
                <SelectItem value="MT">Mato Grosso</SelectItem>
                <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
                <SelectItem value="PA">Pará</SelectItem>
                <SelectItem value="PB">Paraíba</SelectItem>
                <SelectItem value="PR">Paraná</SelectItem>
                <SelectItem value="PE">Pernambuco</SelectItem>
                <SelectItem value="PI">Piauí</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                <SelectItem value="RO">Rondônia</SelectItem>
                <SelectItem value="RR">Roraima</SelectItem>
                <SelectItem value="SC">Santa Catarina</SelectItem>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="SE">Sergipe</SelectItem>
                <SelectItem value="TO">Tocantins</SelectItem>
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-red-500 text-sm">{String(errors.state.message || "Campo obrigatório")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="zipCode" className="font-opensans">CEP *</Label>
            <Input 
              id="zipCode" 
              {...register("zipCode")}
              placeholder="00000-000" 
              className="font-opensans" 
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm">{String(errors.zipCode.message || "Campo obrigatório")}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressSection;
