
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin } from "lucide-react";

interface PersonalDataSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const PersonalDataSection = ({ register, errors }: PersonalDataSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat flex items-center gap-2">
          <User className="h-5 w-5" />
          Dados Pessoais
        </CardTitle>
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
              <p className="text-red-500 text-sm">{String(errors.name.message || "Campo obrigatório")}</p>
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
              <p className="text-red-500 text-sm">{String(errors.cpf.message || "Campo obrigatório")}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="font-opensans">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="email" 
                type="email"
                {...register("email")}
                placeholder="joao@lordveiculos.com" 
                className="font-opensans pl-10" 
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{String(errors.email.message || "Campo obrigatório")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone" className="font-opensans">Telefone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="phone" 
                {...register("phone")}
                placeholder="(11) 99999-9999" 
                className="font-opensans pl-10" 
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm">{String(errors.phone.message || "Campo obrigatório")}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="address" className="font-opensans">Endereço</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              id="address" 
              {...register("address")}
              placeholder="Rua das Flores, 123 - Centro" 
              className="font-opensans pl-10" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalDataSection;
