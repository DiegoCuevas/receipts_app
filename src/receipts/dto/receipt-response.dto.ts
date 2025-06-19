export interface ReceiptResponseDto {
  message: string;
  receipt: {
    id: string;
    companyId: string;
    supplierRuc: string;
    invoiceNumber: string;
    amount: number;
    igv: number;
    total: number;
    issueDate: string;
    documentType: string;
    status: 'pending' | 'validated' | 'rejected' | 'observed';
    createdAt: string;
  };
}
