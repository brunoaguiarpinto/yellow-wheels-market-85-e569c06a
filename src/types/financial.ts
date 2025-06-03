
export interface PaymentMethod {
  id: string;
  type: 'cash' | 'financing' | 'consortium' | 'trade' | 'trade_with_cash';
  details?: FinancingDetails | TradeDetails;
}

export interface FinancingDetails {
  institution: string;
  downPayment: number;
  installments: number;
  interestRate: number;
  monthlyPayment: number;
}

export interface TradeDetails {
  tradeVehicle: {
    brand: string;
    model: string;
    year: number;
    evaluatedValue: number;
  };
  cashDifference: number;
}

export interface PurchasePayment {
  type: 'cash' | 'financing' | 'leasing';
  amount: number;
  installments?: Installment[];
}

export interface Installment {
  id: string;
  number: number;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
}

export interface FinancialSummary {
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
}
