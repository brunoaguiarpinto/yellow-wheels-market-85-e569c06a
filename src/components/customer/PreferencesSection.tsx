
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PreferencesSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
}

const PreferencesSection = ({ register, setValue }: PreferencesSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat">Preferências e Interesses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vehicleInterest" className="font-opensans">Interesse em Veículo</Label>
            <Select onValueChange={(value) => setValue("vehicleInterest", value)}>
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
            <Select onValueChange={(value) => setValue("priceRange", value)}>
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
            {...register("observations")}
            placeholder="Informações adicionais sobre o cliente, preferências específicas, histórico de compras, etc..." 
            className="font-opensans" 
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesSection;
