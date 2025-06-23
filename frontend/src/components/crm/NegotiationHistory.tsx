import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Interaction, InteractionType } from "@/types/crm";
import { useAuth } from "@/contexts/AuthContext";

interface NegotiationHistoryProps {
  customerId: string;
}

const NegotiationHistory = ({ customerId }: NegotiationHistoryProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInteraction, setNewInteraction] = useState("");

  const { data: interactions = [], isLoading } = useQuery<Interaction[]>({
    queryKey: ['interactions', customerId],
    queryFn: async () => {
      const { data } = await api.get(`/interactions/customer/${customerId}`);
      return data;
    },
    enabled: !!customerId,
  });

  const createInteractionMutation = useMutation({
    mutationFn: (interactionData: Partial<Interaction>) => api.post('/interactions', interactionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interactions', customerId] });
      toast({ title: "Interação adicionada", description: "A nova interação foi registrada." });
      setIsDialogOpen(false);
      setNewInteraction("");
    },
    onError: () => {
      toast({ title: "Erro", description: "Não foi possível adicionar a interação.", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInteraction.trim() || !user) return;

    createInteractionMutation.mutate({
      customerId: customerId,
      type: InteractionType.MEETING, // Simplificando para 'meeting' por agora
      description: newInteraction,
      employeeId: user.id,
    });
  };

  const getStatusColor = (type: string) => {
    // Mapeamento simples de tipo para cor
    if (type === 'call') return 'bg-blue-100 text-blue-800';
    if (type === 'email') return 'bg-purple-100 text-purple-800';
    if (type === 'visit') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Histórico de Interações</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Interação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nova Interação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Textarea
                  value={newInteraction}
                  onChange={(e) => setNewInteraction(e.target.value)}
                  placeholder="Descreva a interação com o cliente..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createInteractionMutation.isPending}>
                  {createInteractionMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Interações</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando...</p>
          ) : interactions.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma interação registrada para este cliente.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Funcionário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interactions.map((interaction) => (
                  <TableRow key={interaction.id}>
                    <TableCell>{new Date(interaction.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(interaction.type)}>
                        {interaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{interaction.description}</TableCell>
                    <TableCell>{interaction.employeeName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NegotiationHistory;
