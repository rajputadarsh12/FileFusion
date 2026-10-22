import request from 'supertest';
import app from '../src/app.js';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

describe('FileFusion Server API Tests', () => {
  let samplePdf1Path;
  let samplePdf2Path;

  beforeAll(async () => {
    // Generate two real sample PDFs for automated tests
    const pdf1 = await PDFDocument.create();
    const page1 = pdf1.addPage([400, 600]);
    page1.drawText('Sample PDF 1 Document Content');
    const bytes1 = await pdf1.save();

    const pdf2 = await PDFDocument.create();
    const page2 = pdf2.addPage([400, 600]);
    page2.drawText('Sample PDF 2 Document Content');
    const bytes2 = await pdf2.save();

    samplePdf1Path = path.resolve('test-sample1.pdf');
    samplePdf2Path = path.resolve('test-sample2.pdf');

    fs.writeFileSync(samplePdf1Path, bytes1);
    fs.writeFileSync(samplePdf2Path, bytes2);
  });

  afterAll(() => {
    if (fs.existsSync(samplePdf1Path)) fs.unlinkSync(samplePdf1Path);
    if (fs.existsSync(samplePdf2Path)) fs.unlinkSync(samplePdf2Path);
  });

  test('GET /api/health should return status healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('FileFusion API Server');
  });

  test('POST /api/pdf/merge should combine multiple PDFs', async () => {
    const res = await request(app)
      .post('/api/pdf/merge')
      .attach('files', samplePdf1Path)
      .attach('files', samplePdf2Path);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pageCount).toBe(2);
    expect(res.body.downloadUrl).toMatch(/^\/api\/download\//);
  });

  test('POST /api/pdf/rotate should rotate PDF pages', async () => {
    const res = await request(app)
      .post('/api/pdf/rotate')
      .field('rotation', '90')
      .field('applyTo', 'all')
      .attach('file', samplePdf1Path);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pageCount).toBe(1);
    expect(res.body.downloadUrl).toBeDefined();
  });

  test('POST /api/pdf/compress should compress PDF and return statistics', async () => {
    const res = await request(app)
      .post('/api/pdf/compress')
      .field('compressionLevel', 'medium')
      .attach('file', samplePdf1Path);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.compressedSize).toBeGreaterThan(0);
    expect(res.body.downloadUrl).toBeDefined();
  });

  test('POST /api/document/to-html-pdf should reject unsafe internal SSRF URLs', async () => {
    const res = await request(app)
      .post('/api/document/to-html-pdf')
      .field('url', 'http://127.0.0.1:8080/secret');

    expect(res.status).toBe(500);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('SSRF Security check failed');
  });
});
