
-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'employee' CHECK (role IN ('admin', 'manager', 'employee')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Ativar RLS em todas as tabelas
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_sale_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Função para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Função para verificar se o usuário é manager ou admin
CREATE OR REPLACE FUNCTION public.is_manager_or_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
$$;

-- Políticas para customers
CREATE POLICY "Authenticated users can view customers" ON public.customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can insert customers" ON public.customers
  FOR INSERT TO authenticated WITH CHECK (public.is_manager_or_admin());

CREATE POLICY "Managers can update customers" ON public.customers
  FOR UPDATE TO authenticated USING (public.is_manager_or_admin());

CREATE POLICY "Admins can delete customers" ON public.customers
  FOR DELETE TO authenticated USING (public.is_admin());

-- Políticas para employees
CREATE POLICY "Authenticated users can view employees" ON public.employees
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage employees" ON public.employees
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Políticas para vehicles
CREATE POLICY "Authenticated users can view vehicles" ON public.vehicles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage vehicles" ON public.vehicles
  FOR ALL TO authenticated USING (public.is_manager_or_admin()) WITH CHECK (public.is_manager_or_admin());

-- Políticas para contracts
CREATE POLICY "Authenticated users can view contracts" ON public.contracts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage contracts" ON public.contracts
  FOR ALL TO authenticated USING (public.is_manager_or_admin()) WITH CHECK (public.is_manager_or_admin());

-- Políticas para contract_clauses
CREATE POLICY "Authenticated users can view contract clauses" ON public.contract_clauses
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage contract clauses" ON public.contract_clauses
  FOR ALL TO authenticated USING (public.is_manager_or_admin()) WITH CHECK (public.is_manager_or_admin());

-- Políticas para leads
CREATE POLICY "Authenticated users can view leads" ON public.leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage leads" ON public.leads
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Políticas para tasks
CREATE POLICY "Authenticated users can view tasks" ON public.tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage tasks" ON public.tasks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Políticas para appointments
CREATE POLICY "Authenticated users can view appointments" ON public.appointments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage appointments" ON public.appointments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Políticas para sales
CREATE POLICY "Authenticated users can view sales" ON public.sales
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage sales" ON public.sales
  FOR ALL TO authenticated USING (public.is_manager_or_admin()) WITH CHECK (public.is_manager_or_admin());

-- Políticas para post_sale_issues
CREATE POLICY "Authenticated users can view post sale issues" ON public.post_sale_issues
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage post sale issues" ON public.post_sale_issues
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Políticas para vehicle_costs
CREATE POLICY "Authenticated users can view vehicle costs" ON public.vehicle_costs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage vehicle costs" ON public.vehicle_costs
  FOR ALL TO authenticated USING (public.is_manager_or_admin()) WITH CHECK (public.is_manager_or_admin());

-- Políticas para fixed_costs
CREATE POLICY "Authenticated users can view fixed costs" ON public.fixed_costs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Managers can manage fixed costs" ON public.fixed_costs
  FOR ALL TO authenticated USING (public.is_manager_or_admin()) WITH CHECK (public.is_manager_or_admin());

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'employee')
  );
  RETURN new;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Criar bucket para imagens de veículos
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-images', 'vehicle-images', true);

-- Políticas para o bucket de imagens
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehicle-images');

CREATE POLICY "Allow authenticated upload" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vehicle-images');

CREATE POLICY "Allow authenticated update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'vehicle-images');

CREATE POLICY "Allow authenticated delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'vehicle-images');
