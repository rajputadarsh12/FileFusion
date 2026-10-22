import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import * as imageController from '../controllers/imageController.js';

const router = Router();

router.post('/compress', upload.single('file'), imageController.compress);
router.post('/to-pdf', upload.array('files', 50), imageController.toPdf);

export default router;
