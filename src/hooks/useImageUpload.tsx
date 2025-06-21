
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File, folder: string = 'vehicles'): Promise<string | null> => {
    if (!file) return null;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(fileName);

      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      const fileName = url.split('/').pop();
      if (!fileName) return false;

      const { error } = await supabase.storage
        .from('vehicle-images')
        .remove([fileName]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso!",
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: "Erro ao remover imagem",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return { uploadImage, deleteImage, uploading };
};
