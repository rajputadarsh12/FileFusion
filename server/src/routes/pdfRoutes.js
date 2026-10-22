import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import * as pdfController from '../controllers/pdfController.js';

const router = Router();

// Multiple PDF uploads
router.post('/merge', upload.array('files', 20), pdfController.merge);
router.post('/compare', upload.array('files', 2), pdfController.compare);
router.post('/scan', upload.array('files', 20), pdfController.scan);

// Single PDF uploads
router.post('/split', upload.single('file'), pdfController.split);
router.post('/rotate', upload.single('file'), pdfController.rotate);
router.post('/crop', upload.single('file'), pdfController.crop);
router.post('/compress', upload.single('file'), pdfController.compress);
router.post('/repair', upload.single('file'), pdfController.repair);
router.post('/watermark', upload.single('file'), pdfController.watermark);
router.post('/add-page-numbers', upload.single('file'), pdfController.addPageNumbers);
router.post('/protect', upload.single('file'), pdfController.protect);
router.post('/unlock', upload.single('file'), pdfController.unlock);
router.post('/organize', upload.single('file'), pdfController.organize);
router.post('/to-pdfa', upload.single('file'), pdfController.toPdfA);
router.post('/redact', upload.single('file'), pdfController.redact);
router.post('/forms', upload.single('file'), pdfController.forms);
router.post('/sign', upload.single('file'), pdfController.sign);
router.post('/edit', upload.single('file'), pdfController.edit);
router.post('/to-word', upload.single('file'), pdfController.toWord);
router.post('/to-powerpoint', upload.single('file'), pdfController.toPowerpoint);
router.post('/to-excel', upload.single('file'), pdfController.toExcel);
router.post('/to-jpg', upload.single('file'), pdfController.toJpg);
router.post('/ocr', upload.single('file'), pdfController.ocr);
router.post('/summarize', upload.single('file'), pdfController.summarize);
router.post('/translate', upload.single('file'), pdfController.translate);

export default router;
