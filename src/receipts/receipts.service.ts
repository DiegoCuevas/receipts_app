import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { error } from 'node:console';

const prisma = new PrismaClient();

export class ReceiptDto {
  companyId!: string;
  supplierRuc!: string;
  invoiceNumber!: string;
  amount!: number;
  issueDate!: string;
  documentType!: string;
}

export interface FindAllReceiptsParams {
  filters: {
    issueDate?: Date;
    documentType?: string;
    status?: string;
  };
  page: number;
  limit: number;
}

@Injectable()
export class ReceiptsService {
  async create(dto: ReceiptDto) {
    if (!await this.validateSupplierRuc(dto.supplierRuc)) {
      throw new BadRequestException('RUC inválido según SUNAT');
    }

    const igv = +(dto.amount * 0.18).toFixed(2);
    const total = +(dto.amount + igv).toFixed(2);
    console.log('IGV:', igv, 'Total:', total);
    return prisma.receipt.create({
      data: {
        companyId: dto.companyId,
        supplierRuc: dto.supplierRuc,
        invoiceNumber: dto.invoiceNumber,
        amount: dto.amount,
        igv,
        total,
        issueDate: new Date(dto.issueDate),
        documentType: dto.documentType,
        status: 'pending',
      },
    });
  }

  async validateSupplierRuc(ruc: string): Promise<boolean> {
    return /^[12]0\d{9}$/.test(ruc);
  }

  async findAll(params: FindAllReceiptsParams) {
    const { filters, page, limit } = params;
    const where: any = {};
    if (filters.issueDate) where.issueDate = filters.issueDate;
    if (filters.documentType) where.documentType = filters.documentType;
    if (filters.status) where.status = filters.status;
    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        orderBy: { issueDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.receipt.count({ where }),
    ]);
    return { receipts, total };
  }

  async updateStatus(id: string, status: 'validated' | 'rejected' | 'observed') {
    const validStatuses = ['validated', 'rejected', 'observed'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Estado inválido');
    }

    const existing = await prisma.receipt.findUnique({ where: { id } });
    if (!existing) {
      throw new BadRequestException('No se encontró el recibo con el ID proporcionado');
    }
    const updated = await prisma.receipt.update({
      where: { id },
      data: { status },
    });
    return updated;
  }
}
