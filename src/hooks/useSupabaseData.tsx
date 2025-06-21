
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type TableName = keyof Tables;

export function useSupabaseData<T extends TableName>(
  table: T,
  select?: string,
  filters?: Record<string, any>
) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase.from(table).select(select || '*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      const { data: result, error } = await query;
      
      if (error) throw error;
      
      setData(result || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
      toast({
        title: "Erro ao carregar dados",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table, JSON.stringify(filters)]);

  return { data, loading, error, refetch: fetchData };
}

export function useSupabaseInsert<T extends TableName>(table: T) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const insert = async (data: any): Promise<any | null> => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Registro criado com sucesso!",
      });
      
      return result;
    } catch (err: any) {
      console.error('Error inserting data:', err);
      toast({
        title: "Erro ao criar registro",
        description: err.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { insert, loading };
}

export function useSupabaseUpdate<T extends TableName>(table: T) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const update = async (id: string, data: any): Promise<any | null> => {
    try {
      setLoading(true);
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id' as any, id)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Registro atualizado com sucesso!",
      });
      
      return result;
    } catch (err: any) {
      console.error('Error updating data:', err);
      toast({
        title: "Erro ao atualizar registro",
        description: err.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading };
}

export function useSupabaseDelete<T extends TableName>(table: T) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const deleteRecord = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id' as any, id);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Registro excluído com sucesso!",
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting data:', err);
      toast({
        title: "Erro ao excluir registro",
        description: err.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteRecord, loading };
}
