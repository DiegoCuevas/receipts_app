import { api } from 'encore.dev/api';
import applicationContext from '../applicationContext';
import { ReceiptResponseDto } from './dto/receipt-response.dto';
import { ReceiptDto } from './dto/receipt.dto';
import { ReceiptListQuery, ReceiptListResponse } from './dto/receipt-list.dto';
import { UpdateReceiptStatusResponseDto } from './dto/update-receipt-status.dto';
import { CsvExportResponse } from './dto/receipt-csv.dto';
import { toCsv } from './utils/csv.util';
import { AiQueryRequestDto, AiQueryResponseDto } from './dto/ai-query.dto';
import OpenAI from 'openai';

export const createReceipt = api<ReceiptDto, ReceiptResponseDto>(
  { expose: true, method: 'POST', path: '/receipts' },
  async (dto) => {
    const { receiptsService } = await applicationContext;
    const receipt = await receiptsService.create(dto);

    return {
      message: 'Comprobante registrado exitosamente',
      receipt: {
        id: receipt.id,
        companyId: receipt.companyId,
        supplierRuc: receipt.supplierRuc,
        invoiceNumber: receipt.invoiceNumber,
        amount: receipt.amount,
        igv: receipt.igv,
        total: receipt.total,
        issueDate: receipt.issueDate.toISOString(),
        documentType: receipt.documentType,
        status: receipt.status,
        createdAt: receipt.createdAt.toISOString(),
      },
    };
  },
);

export const listReceipts = api<ReceiptListQuery, ReceiptListResponse>(
  { expose: true, method: 'GET', path: '/receipts' },
  async (query) => {
    const { receiptsService } = await applicationContext;
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 10;
    const filters: any = {};
    if (query.issueDate) filters.issueDate = new Date(query.issueDate);
    if (query.documentType) filters.documentType = query.documentType;
    if (query.status) filters.status = query.status;
    const { receipts, total } = await receiptsService.findAll({
      filters,
      page,
      limit,
    });
    return {
      message: 'Listado de comprobantes de compra',
      receipts: receipts.map((receipt: any) => ({
        id: receipt.id,
        companyId: receipt.companyId,
        supplierRuc: receipt.supplierRuc,
        invoiceNumber: receipt.invoiceNumber,
        amount: receipt.amount,
        igv: receipt.igv,
        total: receipt.total,
        issueDate: receipt.issueDate.toISOString().split('T')[0],
        documentType: receipt.documentType,
        status: receipt.status,
        createdAt: receipt.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
    };
  },
);

export const updateReceiptStatus = api<
  { id: string; status: 'validated' | 'rejected' | 'observed' },
  UpdateReceiptStatusResponseDto
>(
  { expose: true, method: 'PATCH', path: '/receipts/:id/status' },
  async (params: { id: string; status: 'validated' | 'rejected' | 'observed' }) => {
    const { receiptsService } = await applicationContext;
    const updated = await receiptsService.updateStatus(params.id, params.status);
    return {
      message: 'Estado actualizado correctamente',
      receipt: {
        id: updated.id,
        status: updated.status,
        updatedAt: (updated as any).updatedAt
          ? (updated as any).updatedAt.toISOString()
          : new Date().toISOString(),
      },
    };
  },
);

export const exportReceiptsCsv = api<ReceiptListQuery, CsvExportResponse>(
  { expose: true, method: 'GET', path: '/receipts/export/csv' },
  async (query) => {
    const { receiptsService } = await applicationContext;

    const filters: any = {};
    if (query.issueDate) filters.issueDate = new Date(query.issueDate);
    if (query.documentType) filters.documentType = query.documentType;
    if (query.status) filters.status = query.status;

    const { receipts } = await receiptsService.findAll({ filters, page: 1, limit: 10000 });

    const data = receipts.map((receipt: any) => ({
      invoiceNumber: receipt.invoiceNumber,
      amount: receipt.amount,
      igv: receipt.igv,
      total: receipt.total,
      status: receipt.status,
    }));

    const fields = ['invoiceNumber', 'amount', 'igv', 'total', 'status'];
    const csv = toCsv(data, fields);

    return {
      csv,
    };
  },
);

export const aiQuery = api<AiQueryRequestDto, AiQueryResponseDto>(
  { expose: true, method: 'POST', path: '/ai/query' },
  async (dto: AiQueryRequestDto) => {
    const { receiptsService } = await applicationContext;
    const { receipts } = await receiptsService.findAll({ filters: {}, page: 1, limit: 1000 });
    const resumen = receipts.map(r =>
      `Comprobante: ${r.invoiceNumber}, Monto: ${r.amount}, IGV: ${r.igv}, Total: ${r.total}, Fecha: ${r.issueDate.toISOString().split('T')[0]}, Estado: ${r.status}`
    ).join('\n');
    const prompt = `Datos de comprobantes:\n${resumen}\n\nPregunta: ${dto.question}\nRespuesta:`;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Eres un asistente experto en análisis de comprobantes de compra. Responde de forma clara y concisa.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.2,
    });
    const answer = completion.choices[0]?.message?.content?.trim() || 'No se pudo obtener respuesta.';
    return { answer };
  },
);

