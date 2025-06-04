
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PersonalInfoSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const PersonalInfoSection = ({ register, errors }: PersonalInfoSectionProps) => {
  return (
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
              {...register("name")}
              placeholder="Ex: João Silva" 
              className="font-opensans" 
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="cpf" className="font-opensans">CPF *</Label>
            <Input 
              id="cpf" 
              {...register("cpf")}
              placeholder="000.000.000-00" 
              className="font-opensans" 
            />
            {errors.cpf && (
              <p className="text-red-500 text-sm">{errors.cpf.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rg" className="font-opensans">RG</Label>
            <Input 
              id="rg" 
              {...register("rg")}
              placeholder="00.000.000-0" 
              className="font-opensans" 
            />
          </div>
          <div>
            <Label htmlFor="birthDate" className="font-opensans">Data de Nascimento</Label>
            <Input 
              id="birthDate" 
              type="date"
              {...register("birthDate")}
              className="font-opensans" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
