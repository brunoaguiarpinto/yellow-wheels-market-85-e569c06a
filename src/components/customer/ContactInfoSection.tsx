
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactInfoSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const ContactInfoSection = ({ register, errors }: ContactInfoSectionProps) => {
  return (
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
              {...register("email")}
              placeholder="joao@email.com" 
              className="font-opensans" 
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{String(errors.email.message || "Campo obrigatório")}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone" className="font-opensans">Telefone *</Label>
            <Input 
              id="phone" 
              {...register("phone")}
              placeholder="(11) 99999-9999" 
              className="font-opensans" 
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{String(errors.phone.message || "Campo obrigatório")}</p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="whatsapp" className="font-opensans">WhatsApp</Label>
          <Input 
            id="whatsapp" 
            {...register("whatsapp")}
            placeholder="(11) 99999-9999" 
            className="font-opensans" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoSection;
