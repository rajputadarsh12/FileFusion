import path from 'path';
import * as docService from '../services/docService.js';

export async function toPdf(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload an Office document (.docx, .xlsx, .pptx).' });
    }
    const ext = path.extname(req.file.originalname).toLowerCase();
    let result;

    if (ext === '.docx' || ext === '.doc') {
      result = await docService.wordToPdf(req.file.path);
    } else if (ext === '.xlsx' || ext === '.xls') {
      result = await docService.excelToPdf(req.file.path);
    } else if (ext === '.pptx' || ext === '.ppt') {
      result = await docService.powerpointToPdf(req.file.path);
    } else {
      return res.status(400).json({ success: false, error: `Unsupported document format: ${ext}` });
    }

    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function toHtmlPdf(req, res, next) {
  try {
    const { html, url } = req.body;
    let htmlContent = html;
    if (req.file) {
      htmlContent = fs.readFileSync(req.file.path, 'utf-8');
    }

    if (!htmlContent && !url) {
      return res.status(400).json({ success: false, error: 'Please provide either HTML content or a public URL.' });
    }

    const result = await docService.htmlToPdf(htmlContent, url);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function optimize(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a document or image to optimize.' });
    }
    const { targetSize, customKb } = req.body;
    let targetBytes = null;
    if (targetSize === '250kb') targetBytes = 250 * 1024;
    else if (targetSize === '500kb') targetBytes = 500 * 1024;
    else if (targetSize === '1mb') targetBytes = 1024 * 1024;
    else if (targetSize === '2mb') targetBytes = 2 * 1024 * 1024;
    else if (targetSize === 'custom' && customKb) targetBytes = Number(customKb) * 1024;

    const result = await docService.optimizeDocument(req.file.path, targetBytes);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}
