
-- Criar tipos enumerados
CREATE TYPE public.vehicle_status AS ENUM ('purchased', 'available', 'reserved', 'sold', 'maintenance');
CREATE TYPE public.contract_status AS ENUM ('draft', 'pending_signature', 'signed', 'cancelled');
CREATE TYPE public.contract_type AS ENUM ('warranty_term', 'consignment', 'sale');
CREATE TYPE public.issue_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.issue_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.cost_type AS ENUM ('purchase', 'maintenance', 'documentation', 'transport', 'marketing', 'other');
CREATE TYPE public.employee_role AS ENUM ('admin', 'manager', 'salesperson', 'mechanic');

-- Tabela de funcionários
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  document TEXT,
  role employee_role NOT NULL DEFAULT 'salesperson',
  salary DECIMAL(10,2),
  commission_rate DECIMAL(5,2) DEFAULT 0,
  hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de clientes
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  document TEXT,
  birth_date DATE,
  street TEXT,
  number TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de veículos
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  mileage INTEGER DEFAULT 0,
  fuel TEXT NOT NULL,
  transmission TEXT NOT NULL,
  color TEXT NOT NULL,
  plate TEXT,
  chassis TEXT,
  description TEXT,
  status vehicle_status DEFAULT 'available',
  purchase_price DECIMAL(12,2),
  purchase_date DATE,
  supplier TEXT,
  condition TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de vendas
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  sale_price DECIMAL(12,2) NOT NULL,
  down_payment DECIMAL(12,2) DEFAULT 0,
  financing_amount DECIMAL(12,2) DEFAULT 0,
  payment_method TEXT NOT NULL,
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de contratos
CREATE TABLE public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number TEXT UNIQUE NOT NULL,
  contract_type contract_type NOT NULL,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  sale_price DECIMAL(12,2) NOT NULL,
  status contract_status DEFAULT 'draft',
  warranty_amount DECIMAL(10,2),
  warranty_issue TEXT,
  consignment_days INTEGER,
  commission_rate DECIMAL(5,2),
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  signed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de cláusulas de contratos
CREATE TABLE public.contract_clauses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  is_editable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de leads
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  origin TEXT,
  interest TEXT,
  status TEXT DEFAULT 'new',
  employee_id UUID REFERENCES public.employees(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de tarefas
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority issue_priority DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  assigned_to UUID REFERENCES public.employees(id),
  created_by UUID REFERENCES public.employees(id),
  lead_id UUID REFERENCES public.leads(id),
  customer_id UUID REFERENCES public.customers(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de compromissos
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  lead_id UUID REFERENCES public.leads(id),
  type TEXT DEFAULT 'meeting',
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de problemas pós-venda
CREATE TABLE public.post_sale_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  issue_type TEXT NOT NULL,
  description TEXT NOT NULL,
  priority issue_priority DEFAULT 'medium',
  status issue_status DEFAULT 'open',
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  resolved_date DATE,
  resolution TEXT,
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  actual_cost DECIMAL(10,2),
  assigned_to UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de custos de veículos
CREATE TABLE public.vehicle_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  type cost_type NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  invoice_number TEXT,
  supplier TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de custos fixos
CREATE TABLE public.fixed_costs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'monthly',
  due_date DATE,
  is_recurring BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_clauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_sale_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_costs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas (permitir todas as operações por enquanto)
CREATE POLICY "Allow all operations on employees" ON public.employees FOR ALL USING (true);
CREATE POLICY "Allow all operations on customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow all operations on vehicles" ON public.vehicles FOR ALL USING (true);
CREATE POLICY "Allow all operations on sales" ON public.sales FOR ALL USING (true);
CREATE POLICY "Allow all operations on contracts" ON public.contracts FOR ALL USING (true);
CREATE POLICY "Allow all operations on contract_clauses" ON public.contract_clauses FOR ALL USING (true);
CREATE POLICY "Allow all operations on leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON public.tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on appointments" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Allow all operations on post_sale_issues" ON public.post_sale_issues FOR ALL USING (true);
CREATE POLICY "Allow all operations on vehicle_costs" ON public.vehicle_costs FOR ALL USING (true);
CREATE POLICY "Allow all operations on fixed_costs" ON public.fixed_costs FOR ALL USING (true);

-- Criar índices para melhor performance
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_contracts_type ON public.contracts(contract_type);
CREATE INDEX idx_contracts_status ON public.contracts(status);
CREATE INDEX idx_sales_date ON public.sales(sale_date);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX idx_post_sale_issues_status ON public.post_sale_issues(status);
