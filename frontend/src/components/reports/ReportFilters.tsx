
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ReportFilter } from "@/types/reports";
import { Filter, X } from "lucide-react";

interface ReportFiltersProps {
  filters: ReportFilter;
  onFiltersChange: (filters: ReportFilter) => void;
}

const ReportFilters = ({ filters, onFiltersChange }: ReportFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof ReportFilter, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="dateFrom">Data Inicial</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom || ""}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="dateTo">Data Final</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo || ""}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="vehicleBrand">Marca</Label>
              <Select
                value={filters.vehicleBrand || "all"}
                onValueChange={(value) => handleFilterChange("vehicleBrand", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Toyota">Toyota</SelectItem>
                  <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                  <SelectItem value="Ford">Ford</SelectItem>
                  <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fuelType">Combustível</Label>
              <Select
                value={filters.fuelType || "all"}
                onValueChange={(value) => handleFilterChange("fuelType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Gasolina">Gasolina</SelectItem>
                  <SelectItem value="Álcool">Álcool</SelectItem>
                  <SelectItem value="Flex">Flex</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="transmission">Câmbio</Label>
              <Select
                value={filters.transmission || "all"}
                onValueChange={(value) => handleFilterChange("transmission", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                  <SelectItem value="Automático">Automático</SelectItem>
                  <SelectItem value="CVT">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ReportFilters;
