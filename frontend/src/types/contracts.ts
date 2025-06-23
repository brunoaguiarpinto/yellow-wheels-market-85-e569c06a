
export interface Contract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  customerDocument: string;
  customerAddress: string;
  customerPhone?: string;
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleColor: string;
  vehicleFuel: string;
  vehiclePlate: string;
  vehicleChassis: string;
  vehicleKm: number;
  salePrice: number;
  employeeId: string;
  employeeName: string;
  status: ContractStatus;
  contractType: ContractType;
  createdAt: string;
  updatedAt: string;
  signedAt?: string;
  clauses: ContractClause[];
  observations?: string;
  paymentTerms: PaymentTerms;
  // Campos específicos para diferentes tipos de contrato
  warrantyAmount?: number; // Para termo de garantia
  warrantyIssue?: string; // Para termo de garantia
  consignmentDays?: number; // Para consignação
  commissionRate?: number; // Para consignação
  tradeInVehicle?: TradeInVehicle; // Para compra e venda
}

export enum ContractType {
  WARRANTY_TERM = 'warranty_term',
  CONSIGNMENT = 'consignment',
  SALE = 'sale'
}

export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_SIGNATURE = 'pending_signature',
  SIGNED = 'signed',
  CANCELLED = 'cancelled'
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  isEditable: boolean;
  order: number;
}

export interface PaymentTerms {
  paymentMethod: 'cash' | 'financing' | 'mixed';
  downPayment?: number;
  financingAmount?: number;
  installments?: number;
  monthlyPayment?: number;
  financingCompany?: string;
  creditCardAmount?: number;
  creditCardInstallments?: number;
  debitCardAmount?: number;
}

export interface TradeInVehicle {
  brand: string;
  model: string;
  year: number;
  color: string;
  plate: string;
  chassis: string;
  km: number;
  value: number;
}

export interface ContractTemplate {
  id: string;
  name: string;
  type: ContractType;
  clauses: ContractClause[];
  isDefault: boolean;
}

// Predefined contract templates
export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'warranty_term',
    name: 'Termo de Acordo de Garantia e Isenção de Responsabilidade',
    type: ContractType.WARRANTY_TERM,
    isDefault: true,
    clauses: [
      {
        id: '1',
        title: 'OBJETO',
        content: 'O presente Termo tem por objeto o registro formal de que o cliente recebeu o valor de [VALOR_GARANTIA] referente à garantia exigida do veículo [MARCA] [MODELO] [ANO_FABRICACAO]/[ANO_MODELO] PLACA [PLACA]. Cliente relatou problemas com [PROBLEMA_RELATADO]. Foi feito um acordo de pagamento parcial por parte da empresa vendedora, que a isenta de qualquer responsabilidade referente a este problema relatado.',
        isEditable: true,
        order: 1
      },
      {
        id: '2',
        title: 'CIÊNCIA E ACEITAÇÃO DO ACORDO',
        content: 'O Cliente declara, para todos os fins de direito, que: a) foi devidamente informado, de forma clara e precisa, acerca do acordo feito e que isso encerra qualquer responsabilidade da empresa relacionado ao problema relatado; b) opta, de forma livre e consciente, por aceitar o seguinte acordo sobre os problemas previamente relatados, assumindo integral responsabilidade por eventuais reparos, manutenções ou falhas futuras relativas ao defeito identificado.',
        isEditable: true,
        order: 2
      },
      {
        id: '3',
        title: 'RENÚNCIA EXPRESSA À GARANTIA',
        content: 'O Cliente renuncia, de forma expressa e irrevogável, a qualquer direito de acionamento de garantia legal, contratual ou tácita sobre o(s) defeito(s) já informado(s), declarando-se plenamente ciente. A Vendedora não responderá por quaisquer custos, reparos, manutenções ou substituições futuras relacionadas ao problema informado, isentando-se de toda e qualquer responsabilidade civil, contratual ou legal, presente ou futura, sobre tal questão.',
        isEditable: true,
        order: 3
      },
      {
        id: '4',
        title: 'DISPOSIÇÕES FINAIS',
        content: 'Este Termo é firmado em caráter definitivo, sendo válido como prova documental da ciência, concordância e renúncia expressa do Cliente quanto à garantia limitada do bem. As partes elegem o foro da comarca de Campo Grande/MS, com renúncia expressa de qualquer outro, por mais privilegiado que seja, para dirimir eventuais controvérsias decorrentes deste instrumento.',
        isEditable: true,
        order: 4
      }
    ]
  },
  {
    id: 'consignment',
    name: 'Contrato de Consignação e Termo de Responsabilidade',
    type: ContractType.CONSIGNMENT,
    isDefault: true,
    clauses: [
      {
        id: '1',
        title: 'OBJETO',
        content: 'Marca: [MARCA], Modelo: [MODELO], Cor: [COR], Combustível: [COMBUSTIVEL], Ano Fab/Mod: [ANO_FABRICACAO]/[ANO_MODELO], Km: [QUILOMETRAGEM], Placa: [PLACA], Chassi: [CHASSI]. O veículo acima descrito encontra-se em nome de: [NOME_CLIENTE]',
        isEditable: true,
        order: 1
      },
      {
        id: '2',
        title: 'VALOR',
        content: 'A CONSIGNATÁRIA fica autorizada através do presente, a vender o bem objeto do presente, pelo valor de R$ [VALOR_VENDA]',
        isEditable: true,
        order: 2
      },
      {
        id: '3',
        title: 'DA COMISSÃO',
        content: 'Fica desde já estabelecido, que na hipótese do veículo objeto do presente ser vendido pelo valor acima referido, ou ainda, por valor inferior ao supra consignado e, nesta hipótese, desde que com anuência do(a) consignante, este (a) último (a), pagará à CONSIGNATÁRIA comissão de [PERCENTUAL_COMISSAO]% sobre o valor da transação, a qual será retida pela CONSIGNATÁRIA, no ato do pagamento por parte do comprador.',
        isEditable: true,
        order: 3
      },
      {
        id: '4',
        title: 'DAS RESPONSABILIDADES',
        content: 'O CONSIGNANTE se responsabiliza pela evicção, por eventuais vícios redibitórios, bem como todas as multas, sejam elas Federais, Estaduais e ou Municipais, até a presente data. Esta CONSIGNATÁRIA fica desde já autorizada, após tentativa amigável de cobrança, mediante notificação extrajudicial, a proceder a execução do valor atualizado do débito.',
        isEditable: true,
        order: 4
      },
      {
        id: '5',
        title: 'DO PRAZO',
        content: 'A presente autorização de venda se dá pelo prazo de [PRAZO_DIAS] dias, prorrogando-se automaticamente no caso de silêncio do CONSIGNANTE.',
        isEditable: true,
        order: 5
      }
    ]
  },
  {
    id: 'sale',
    name: 'Contrato de Compra e Venda',
    type: ContractType.SALE,
    isDefault: true,
    clauses: [
      {
        id: '1',
        title: 'DO OBJETO',
        content: 'Marca: [MARCA], Modelo: [MODELO], Cor: [COR], Combustível: [COMBUSTIVEL], Ano Fab/Mod: [ANO_FABRICACAO]/[ANO_MODELO], Km: [QUILOMETRAGEM], Placa: [PLACA], Chassi: [CHASSI]',
        isEditable: true,
        order: 1
      },
      {
        id: '2',
        title: 'DO PREÇO E FORMA DE PAGAMENTO',
        content: 'R$ [VALOR_TABELA] valor de tabela, R$ [VALOR_DESCONTO] valor do desconto, R$ [VALOR_VENDA] valor da venda. O pagamento se dará da seguinte forma: [DETALHES_PAGAMENTO]',
        isEditable: true,
        order: 2
      },
      {
        id: '3',
        title: 'DA VISTORIA E AVALIAÇÃO DO VEÍCULO',
        content: 'O COMPRADOR declara ter vistoriado e avaliado o estado em que se encontra o veículo ora negociado, estando o mesmo em perfeitas condições de funcionamento e estado de conservação.',
        isEditable: true,
        order: 3
      },
      {
        id: '4',
        title: 'DA RESPONSABILIDADE CIVIL E CRIMINAL',
        content: 'A partir desta data [DATA_VENDA] e hora [HORA_VENDA], o COMPRADOR se responsabiliza por quaisquer danos, seja no âmbito civil ou criminal, decorrente da utilização do veículo ora adquirido, inclusive multas e pontuações na CNH.',
        isEditable: true,
        order: 4
      },
      {
        id: '5',
        title: 'DA GARANTIA',
        content: 'Para os veículos usados a VENDEDORA fornece a garantia pelo tempo exigido por lei, e somente para os componentes internos de motor e caixa de câmbio, contudo, a mesma estará automaticamente cancelada, no caso de mau uso do veículo em questão.',
        isEditable: true,
        order: 5
      },
      {
        id: '6',
        title: 'DA TRANSFERÊNCIA DO BEM',
        content: 'A transferência do bem objeto do presente instrumento para o nome do comprador ou de alguém por ele determinado, só se dará após a total quitação do bem descrito na cláusula primeira deste.',
        isEditable: true,
        order: 6
      },
      {
        id: '7',
        title: 'DA CLÁUSULA RESOLUTIVA',
        content: 'As partes estabelecem que no caso de não cumprimento do presente, quanto aos pagamentos devidos pelo COMPRADOR ao VENDEDOR, permitirá ao VENDEDOR pedir a resolução do contrato ou exigir o cumprimento do mesmo.',
        isEditable: true,
        order: 7
      },
      {
        id: '8',
        title: 'DEPOSITÁRIO',
        content: 'Nos termos do artigo 629 do Código Civil, o COMPRADOR assume a condição de depositário do bem objeto do presente, obrigando-se pela guarda e conservação do mesmo.',
        isEditable: true,
        order: 8
      },
      {
        id: '9',
        title: 'LEI GERAL DE PROTEÇÃO DE DADOS',
        content: 'A empresa VENDEDORA está em conformidade com a Lei 13.709/2018 – LGPD, protegendo os direitos fundamentais de liberdade e de privacidade no que diz respeito às operações realizadas com os dados pessoais.',
        isEditable: true,
        order: 9
      },
      {
        id: '10',
        title: 'FORO DE ELEIÇÃO',
        content: 'Para dirimir quaisquer dúvidas decorrentes do presente, as partes estabelecem o foro da Comarca de Campo Grande/MS, por mais privilegiado que outro possa ser.',
        isEditable: true,
        order: 10
      }
    ]
  }
];
