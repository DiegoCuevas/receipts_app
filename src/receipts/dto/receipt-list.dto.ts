export interface ReceiptListQuery {
  page?: number;
  limit?: number;
  issueDate?: string;
  documentType?: string;
  status?: string;
}

export interface ReceiptListItem {
  id: string;
  companyId: string;
  supplierRuc: string;
  invoiceNumber: string;
  amount: number;
  igv: number;
  total: number;
  issueDate: string;
  documentType: string;
  status: string;
  createdAt: string;
}

export interface ReceiptListResponse {
  message: string;
  receipts: ReceiptListItem[];
  total: number;
  page: number;
  limit: number;
}
