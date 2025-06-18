export interface UpdateReceiptStatusResponseDto {
  message: string;
  receipt: {
    id: string;
    status: string;
    updatedAt: string;
  };
}
