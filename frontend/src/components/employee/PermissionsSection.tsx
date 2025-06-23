
import { UseFormGetValues, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Key } from "lucide-react";

interface PermissionsSectionProps {
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
}

const PermissionsSection = ({ getValues, setValue, watch }: PermissionsSectionProps) => {
  const permissions = [
    { id: 'vehicles.create', label: 'Criar Veículos' },
    { id: 'vehicles.edit', label: 'Editar Veículos' },
    { id: 'vehicles.delete', label: 'Excluir Veículos' },
    { id: 'clients.create', label: 'Criar Clientes' },
    { id: 'clients.edit', label: 'Editar Clientes' },
    { id: 'sales.view', label: 'Ver Vendas' },
    { id: 'sales.create', label: 'Criar Vendas' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-montserrat flex items-center gap-2">
          <Key className="h-5 w-5" />
          Permissões do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <Checkbox 
                id={permission.id}
                checked={watch("permissions")?.includes(permission.id) || false}
                onCheckedChange={(checked) => {
                  const currentPermissions = getValues("permissions") || [];
                  if (checked) {
                    setValue("permissions", [...currentPermissions, permission.id]);
                  } else {
                    setValue("permissions", currentPermissions.filter((p: string) => p !== permission.id));
                  }
                }}
              />
              <Label htmlFor={permission.id} className="font-opensans text-sm">
                {permission.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionsSection;
