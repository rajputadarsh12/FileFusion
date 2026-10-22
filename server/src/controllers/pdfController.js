import fs from 'fs';
import * as pdfService from '../services/pdfService.js';
import * as docService from '../services/docService.js';
import * as aiService from '../services/aiService.js';
import * as ocrService from '../services/ocrService.js';
import * as imageService from '../services/imageService.js';
import { extractTextFromPdf } from '../utils/pdfExtractor.js';

export async function merge(req, res, next) {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ success: false, error: 'Please upload at least 2 PDF files to merge.' });
    }
    const filePaths = req.files.map((f) => f.path);
    const result = await pdfService.mergePdfs(filePaths);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function split(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file to split.' });
    }
    const { splitMode, pageRanges } = req.body;
    const result = await pdfService.splitPdf(req.file.path, splitMode, pageRanges);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function rotate(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file to rotate.' });
    }
    const { rotation, applyTo, pages } = req.body;
    const result = await pdfService.rotatePdf(req.file.path, rotation, applyTo, pages);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function crop(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file to crop.' });
    }
    const { marginTrim, customCrop } = req.body;
    const result = await pdfService.cropPdf(req.file.path, marginTrim, customCrop);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function compress(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file to compress.' });
    }
    const { compressionLevel } = req.body;
    const result = await pdfService.compressPdf(req.file.path, compressionLevel);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function repair(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file to repair.' });
    }
    const result = await pdfService.repairPdf(req.file.path);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function watermark(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file to watermark.' });
    }
    const { watermarkText, opacity, rotation, color } = req.body;
    const result = await pdfService.watermarkPdf(req.file.path, watermarkText, opacity, rotation, color);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function addPageNumbers(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    }
    const { position, format, startPage } = req.body;
    const result = await pdfService.addPageNumbers(req.file.path, position, format, startPage);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function protect(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    }
    const { userPassword, confirmPassword } = req.body;
    if (!userPassword || userPassword !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords must match and cannot be empty.' });
    }
    const result = await pdfService.protectPdf(req.file.path, userPassword);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function unlock(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    }
    const { password } = req.body;
    const result = await pdfService.unlockPdf(req.file.path, password);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function organize(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    }
    const { operations } = req.body;
    const result = await pdfService.organizePdf(req.file.path, operations);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function toPdfA(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    }
    const { conformanceLevel } = req.body;
    const result = await pdfService.pdfToPdfA(req.file.path, conformanceLevel);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function redact(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    }
    const { redactionZones } = req.body;
    const result = await pdfService.redactPdf(req.file.path, redactionZones);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function forms(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    }
    const { formData } = req.body;
    const result = await pdfService.processPdfForms(req.file.path, formData);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function sign(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    }
    const { signatureDataUrl, position } = req.body;
    const result = await pdfService.signPdf(req.file.path, signatureDataUrl, position);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function edit(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    }
    const { annotations } = req.body;
    const result = await pdfService.editPdf(req.file.path, annotations);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function compare(req, res, next) {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ success: false, error: 'Please upload two PDF files to compare.' });
    }
    const data1 = await extractTextFromPdf(req.files[0].path);
    const data2 = await extractTextFromPdf(req.files[1].path);

    const words1 = (data1.text || '').split(/\s+/).filter(Boolean);
    const words2 = (data2.text || '').split(/\s+/).filter(Boolean);

    res.json({
      success: true,
      file1: { name: req.files[0].originalname, pages: data1.numpages, wordCount: words1.length },
      file2: { name: req.files[1].originalname, pages: data2.numpages, wordCount: words2.length },
      text1Preview: data1.text.slice(0, 1500),
      text2Preview: data2.text.slice(0, 1500),
      differencesCount: Math.abs(words1.length - words2.length),
    });
  } catch (err) {
    next(err);
  }
}

export async function toWord(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    const result = await docService.pdfToWord(req.file.path);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function toPowerpoint(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    const result = await docService.pdfToPowerpoint(req.file.path);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function toExcel(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    const result = await docService.pdfToExcel(req.file.path);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function toJpg(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF file.' });
    const { imageFormat, dpiQuality } = req.body;
    const result = await docService.pdfToJpg(req.file.path, imageFormat, dpiQuality);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function ocr(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a document or image for OCR.' });
    const { language, outputFormat } = req.body;
    const result = await ocrService.processOcr(req.file.path, language, outputFormat);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function scan(req, res, next) {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) return res.status(400).json({ success: false, error: 'Please upload scanned images.' });
    const { filter } = req.body;
    const result = await imageService.scanToPdf(files.map((f) => f.path), filter);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function summarize(req, res, next) {
  try {
    let text = req.body.text || '';
    if (req.file) {
      const parsed = await extractTextFromPdf(req.file.path);
      text = parsed.text || '';
    }
    const { summaryMode, length } = req.body;
    const result = await aiService.summarizeDocument(text, summaryMode, length);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function translate(req, res, next) {
  try {
    let text = req.body.text || '';
    if (req.file) {
      const parsed = await extractTextFromPdf(req.file.path);
      text = parsed.text || '';
    }
    const { targetLanguage } = req.body;
    const result = await aiService.translateDocument(text, targetLanguage);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}
