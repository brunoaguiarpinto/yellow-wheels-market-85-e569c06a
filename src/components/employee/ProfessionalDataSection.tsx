
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield } from "lucide-react";

interface ProfessionalDataSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: FieldErrors<any>;
}

const ProfessionalDataSection = ({ register, setValue, watch, errors }: ProfessionalDataSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Dados Profissionais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="position" className="font-opensans">Cargo *</Label>
            <Select 
              value={watch("position")} 
              onValueChange={(value) => setValue("position", value)}
            >
              <SelectTrigger className="font-opensans">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendedor">Vendedor</SelectItem>
                <SelectItem value="gerente">Gerente de Vendas</SelectItem>
                <SelectItem value="financeiro">Analista Financeiro</SelectItem>
                <SelectItem value="atendimento">Atendimento ao Cliente</SelectItem>
              </SelectContent>
            </Select>
            {errors.position && (
              <p className="text-red-500 text-sm">{String(errors.position.message || "Campo obrigatório")}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="department" className="font-opensans">Departamento *</Label>
            <Select 
              value={watch("department")} 
              onValueChange={(value) => setValue("department", value)}
            >
              <SelectTrigger className="font-opensans">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vendas">Vendas</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="atendimento">Atendimento</SelectItem>
                <SelectItem value="administracao">Administração</SelectItem>
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-red-500 text-sm">{String(errors.department.message || "Campo obrigatório")}</p>
            )}
          </div>

          <div>
            <Label htmlFor="hireDate" className="font-opensans">Data de Contratação *</Label>
            <Input 
              id="hireDate" 
              type="date"
              {...register("hireDate")}
              className="font-opensans" 
            />
            {errors.hireDate && (
              <p className="text-red-500 text-sm">{String(errors.hireDate.message || "Campo obrigatório")}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="commissionRate" className="font-opensans">Taxa de Comissão (%)</Label>
          <Input 
            id="commissionRate" 
            type="number"
            min="0"
            max="100"
            {...register("commissionRate", { valueAsNumber: true })}
            placeholder="5" 
            className="font-opensans" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalDataSection;
