import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import * as docController from '../controllers/docController.js';

const router = Router();

router.post('/to-pdf', upload.single('file'), docController.toPdf);
router.post('/to-html-pdf', upload.single('file'), docController.toHtmlPdf);
router.post('/optimize', upload.single('file'), docController.optimize);

export default router;
