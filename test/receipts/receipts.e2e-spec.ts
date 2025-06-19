import { describe, it, expect } from 'vitest';
import request from 'supertest';

const API_URL = 'http://localhost:4000';

describe('Receipts API (e2e)', () => {
  let createdId: string;

  it('POST /receipts - debe registrar un comprobante', async () => {
    const res = await request(API_URL)
      .post('/receipts')
      .send({
        companyId: 'test-company',
        supplierRuc: '20123456789',
        invoiceNumber: 'F001-999',
        amount: 150,
        issueDate: '2025-06-18',
        documentType: 'FACTURA',
      })
      .expect(200);
    expect(res.body.receipt).toBeDefined();
    expect(res.body.receipt.igv).toBeCloseTo(27, 1);
    createdId = res.body.receipt.id;
  });

  it('GET /receipts - debe listar comprobantes', async () => {
    const res = await request(API_URL)
      .get('/receipts?page=1&limit=2')
      .expect(200);
    expect(Array.isArray(res.body.receipts)).toBe(true);
    expect(res.body.page).toBe(1);
  });

  it('PATCH /receipts/:id/status - debe actualizar el estado', async () => {
    const res = await request(API_URL)
      .patch(`/receipts/${createdId}/status`)
      .send({ status: 'validated' })
      .expect(200);
    expect(res.body.receipt.status).toBe('validated');
  });

  it('GET /receipts/export/csv - debe exportar CSV', async () => {
    const res = await request(API_URL)
      .get('/receipts/export/csv')
      .expect(200);
    expect(typeof res.body.csv).toBe('string');
    expect(res.body.csv).toContain('invoiceNumber');
  });

  it('POST /ai/query - debe responder con AI', async () => {
    const res = await request(API_URL)
      .post('/ai/query')
      .send({ question: '¿Cuántos comprobantes hay?' })
      .expect(200);
    expect(typeof res.body.answer).toBe('string');
  });
});
