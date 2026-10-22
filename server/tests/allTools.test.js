import request from 'supertest';
import app from '../src/app.js';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

describe('Comprehensive Suite: All File Utilities & Security', () => {
  let samplePdfPath;
  let sampleImagePath;

  beforeAll(async () => {
    // Generate a multi-page test PDF
    const pdfDoc = await PDFDocument.create();
    const p1 = pdfDoc.addPage([500, 700]);
    p1.drawText('Sample Header Page 1: FileFusion Testing Overview');
    const p2 = pdfDoc.addPage([500, 700]);
    p2.drawText('Page 2: Financial Table Data\nQ1 Revenue: 50,000\nQ2 Revenue: 75,000');
    const p3 = pdfDoc.addPage([500, 700]);
    p3.drawText('Page 3: Conclusion & Next Steps');
    const pdfBytes = await pdfDoc.save();

    samplePdfPath = path.resolve('test-multipage.pdf');
    fs.writeFileSync(samplePdfPath, pdfBytes);

    // Generate a sample test image
    const imgBuffer = await sharp({
      create: {
        width: 400,
        height: 300,
        channels: 3,
        background: { r: 50, g: 120, b: 220 },
      },
    })
      .jpeg()
      .toBuffer();

    sampleImagePath = path.resolve('test-image.jpg');
    fs.writeFileSync(sampleImagePath, imgBuffer);
  });

  afterAll(() => {
    if (fs.existsSync(samplePdfPath)) fs.unlinkSync(samplePdfPath);
    if (fs.existsSync(sampleImagePath)) fs.unlinkSync(sampleImagePath);
  });

  // 1. Split PDF
  test('Split PDF - range mode extracts requested pages', async () => {
    const res = await request(app)
      .post('/api/pdf/split')
      .field('splitMode', 'range')
      .field('pageRanges', '1-2')
      .attach('file', samplePdfPath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pageCount).toBe(2);
    expect(res.body.downloadUrl).toBeDefined();
  });

  // 2. Watermark PDF
  test('Watermark PDF stamps watermark text across pages', async () => {
    const res = await request(app)
      .post('/api/pdf/watermark')
      .field('watermarkText', 'CONFIDENTIAL DRAFT')
      .field('opacity', '40')
      .field('rotation', '45')
      .attach('file', samplePdfPath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pageCount).toBe(3);
  });

  // 3. Add Page Numbers
  test('Add Page Numbers inserts numbering on all pages', async () => {
    const res = await request(app)
      .post('/api/pdf/add-page-numbers')
      .field('position', 'bottom-center')
      .field('format', 'page_n_of_total')
      .attach('file', samplePdfPath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pageCount).toBe(3);
  });

  // 4. PDF to Word (.docx)
  test('PDF to Word creates valid .docx file', async () => {
    const res = await request(app)
      .post('/api/pdf/to-word')
      .attach('file', samplePdfPath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.filename).toMatch(/\.docx$/);
    expect(res.body.size).toBeGreaterThan(0);
  });

  // 5. PDF to Excel (.xlsx)
  test('PDF to Excel creates valid .xlsx workbook and preview', async () => {
    const res = await request(app)
      .post('/api/pdf/to-excel')
      .attach('file', samplePdfPath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.filename).toMatch(/\.xlsx$/);
    expect(res.body.previewData).toBeDefined();
  });

  // 6. PDF to PowerPoint (.pptx)
  test('PDF to PowerPoint creates valid .pptx presentation', async () => {
    const res = await request(app)
      .post('/api/pdf/to-powerpoint')
      .attach('file', samplePdfPath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.filename).toMatch(/\.pptx$/);
    expect(res.body.slideCount).toBeGreaterThan(0);
  });

  // 7. PDF to PDF/A
  test('PDF to PDF/A adds archival standard metadata and report', async () => {
    const res = await request(app)
      .post('/api/pdf/to-pdfa')
      .field('conformanceLevel', 'pdfa-1b')
      .attach('file', samplePdfPath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.validationReport.compliant).toBe(true);
  });

  // 8. Image Compressor
  test('Image Compressor reduces image size and returns percentage', async () => {
    const res = await request(app)
      .post('/api/image/compress')
      .field('quality', '60')
      .attach('file', sampleImagePath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.compressedSize).toBeGreaterThan(0);
  });

  // 9. Image to PDF
  test('Image to PDF compiles images into PDF', async () => {
    const res = await request(app)
      .post('/api/image/to-pdf')
      .field('pageSize', 'a4')
      .field('orientation', 'portrait')
      .attach('files', sampleImagePath);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pageCount).toBe(1);
  });

  // 10. AI Document Summarizer
  test('AI Document Summarizer extracts key takeaways from text', async () => {
    const res = await request(app)
      .post('/api/pdf/summarize')
      .field('text', 'Artificial Intelligence is revolutionizing modern document workflows. Automated extraction allows users to summarize hundreds of pages in seconds. FileFusion integrates smart NLP algorithms to deliver instant executive briefings with zero friction.')
      .field('summaryMode', 'bullet');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.summary).toBeDefined();
    expect(res.body.takeaways.length).toBeGreaterThan(0);
  });

  // 11. Protect and Unlock PDF
  test('Protect PDF encrypts with password and Unlock decrypts', async () => {
    const protectRes = await request(app)
      .post('/api/pdf/protect')
      .field('userPassword', 'SecretPass123')
      .field('confirmPassword', 'SecretPass123')
      .attach('file', samplePdfPath);

    expect(protectRes.status).toBe(200);
    expect(protectRes.body.success).toBe(true);

    const unlockRes = await request(app)
      .post('/api/pdf/unlock')
      .field('password', 'SecretPass123')
      .attach('file', samplePdfPath);

    expect(unlockRes.status).toBe(200);
    expect(unlockRes.body.success).toBe(true);
  });

  // 12. Security: Path Traversal Protection on Download
  test('Download endpoint rejects path traversal attacks', async () => {
    const res = await request(app).get('/api/download/..%2F..%2Fpackage.json');
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid filename');
  });
});
