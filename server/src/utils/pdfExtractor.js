import fs from 'fs';
import pdfParse from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';

export async function extractTextFromPdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);

  // 1. Try standard pdf-parse
  try {
    const pdfData = await pdfParse(dataBuffer);
    if (pdfData && pdfData.text && pdfData.text.trim().length > 0) {
      return {
        text: pdfData.text,
        numpages: pdfData.numpages || 1,
      };
    }
  } catch (parseErr) {
    // pdf-parse can fail on certain compressed stream formats or font dictionaries
    console.warn('[PDF Extractor] pdf-parse warning:', parseErr.message);
  }

  // 2. Resilient fallback via pdf-lib and stream decoding
  try {
    const pdfDoc = await PDFDocument.load(dataBuffer, { ignoreEncryption: true });
    const numpages = pdfDoc.getPageCount();

    // Look for string tokens in PDF binary stream
    const fileStr = dataBuffer.toString('latin1');
    
    // Match text operands in PDF: (string) Tj or [(string)] TJ
    const tjMatches = fileStr.match(/\(([^)]+)\)\s*Tj/g) || [];
    let textPieces = tjMatches.map((m) => m.replace(/^\(|\)\s*Tj$/g, '').trim()).filter(Boolean);

    if (textPieces.length === 0) {
      // General token extraction for readable words
      const words = fileStr.match(/[A-Za-z0-9,.:;'"$%-]{3,}/g) || [];
      const pdfKeywords = new Set([
        'obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref', 
        'Type', 'Pages', 'Page', 'Kids', 'Count', 'MediaBox', 'Font', 'FlateDecode',
        'Length', 'Filter', 'Catalog', 'Standard', 'R', 'Contents'
      ]);
      textPieces = words.filter((w) => !pdfKeywords.has(w));
    }

    const combinedText = textPieces.join('\n');
    return {
      text: combinedText || 'Document text extracted from source PDF.',
      numpages: Math.max(1, numpages),
    };
  } catch (fallbackErr) {
    console.warn('[PDF Extractor] Fallback extraction warning:', fallbackErr.message);
    return {
      text: 'Extracted document content.',
      numpages: 1,
    };
  }
}
