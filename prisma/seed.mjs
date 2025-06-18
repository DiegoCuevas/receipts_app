import { PrismaClient, ReceiptStatus } from '@prisma/client';
const prisma = new PrismaClient();
const receipts = [
    {
        companyId: '1',
        supplierRuc: '20123456789',
        invoiceNumber: 'F001-001',
        amount: 100,
        igv: 18,
        total: 118,
        issueDate: new Date('2025-06-01'),
        documentType: 'FACTURA',
        status: ReceiptStatus.pending,
    },
    {
        companyId: '1',
        supplierRuc: '20123456780',
        invoiceNumber: 'F001-002',
        amount: 200,
        igv: 36,
        total: 236,
        issueDate: new Date('2025-05-15'),
        documentType: 'FACTURA',
        status: ReceiptStatus.validated,
    },
    {
        companyId: '2',
        supplierRuc: '20123456781',
        invoiceNumber: 'B001-001',
        amount: 50,
        igv: 9,
        total: 59,
        issueDate: new Date('2025-04-10'),
        documentType: 'BOLETA',
        status: ReceiptStatus.rejected,
    },
    {
        companyId: '2',
        supplierRuc: '20123456782',
        invoiceNumber: 'B001-002',
        amount: 75,
        igv: 13.5,
        total: 88.5,
        issueDate: new Date('2025-06-10'),
        documentType: 'BOLETA',
        status: ReceiptStatus.observed,
    },
];
async function main() {
    await prisma.receipt.deleteMany(); // Limpia antes de insertar
    for (const data of receipts) {
        await prisma.receipt.create({ data });
    }
    console.log('Seed ejecutado correctamente');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.mjs.map