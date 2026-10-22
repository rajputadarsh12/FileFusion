import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';
import { OUTPUT_DIR } from '../utils/tempManager.js';

// 1. Compress Image (JPG, PNG, WebP)
export async function compressImage(filePath, quality = 75, maxWidth = 'original') {
  const originalStats = fs.statSync(filePath);
  const originalSize = originalStats.size;

  let image = sharp(filePath);
  const metadata = await image.metadata();

  // Resize if maxWidth is specified and smaller than original width
  if (maxWidth && maxWidth !== 'original') {
    const widthNum = parseInt(maxWidth, 10);
    if (!isNaN(widthNum) && metadata.width && metadata.width > widthNum) {
      image = image.resize({ width: widthNum, withoutEnlargement: true });
    }
  }

  const q = Math.max(10, Math.min(100, parseInt(quality, 10) || 75));
  let outputFormat = metadata.format || 'jpeg';
  if (outputFormat === 'jpg') outputFormat = 'jpeg';

  let buffer;
  if (outputFormat === 'jpeg') {
    buffer = await image.jpeg({ quality: q, mozjpeg: true }).toBuffer();
  } else if (outputFormat === 'png') {
    // PNG compression: palette quantization or compressionLevel
    buffer = await image.png({ quality: q, compressionLevel: 9, palette: true }).toBuffer();
  } else if (outputFormat === 'webp') {
    buffer = await image.webp({ quality: q }).toBuffer();
  } else {
    // Default to jpeg
    buffer = await image.jpeg({ quality: q }).toBuffer();
    outputFormat = 'jpeg';
  }

  const ext = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
  const outputFileName = `compressed-${Date.now()}-${uuidv4().slice(0, 8)}.${ext}`;
  const outputPath = path.join(OUTPUT_DIR, outputFileName);
  fs.writeFileSync(outputPath, buffer);

  const newSize = buffer.length;
  const savedBytes = Math.max(0, originalSize - newSize);
  const percentage = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

  return {
    filename: outputFileName,
    path: outputPath,
    originalSize,
    compressedSize: newSize,
    savedBytes,
    percentage,
    format: outputFormat,
  };
}

// 2. Convert Images to PDF
export async function imagesToPdf(filePaths, pageSize = 'a4', orientation = 'portrait', margin = 'small') {
  const pdfDoc = await PDFDocument.create();

  let marginPt = 18;
  if (margin === 'none') marginPt = 0;
  else if (margin === 'big') marginPt = 36;

  for (const filePath of filePaths) {
    // Normalize image using sharp to PNG or JPEG buffer
    const sharpInstance = sharp(filePath);
    const meta = await sharpInstance.metadata();
    const isPng = meta.format === 'png';
    const normalizedBuffer = isPng ? await sharpInstance.png().toBuffer() : await sharpInstance.jpeg().toBuffer();

    const embeddedImage = isPng
      ? await pdfDoc.embedPng(normalizedBuffer)
      : await pdfDoc.embedJpg(normalizedBuffer);

    const imgWidth = embeddedImage.width;
    const imgHeight = embeddedImage.height;

    let pageWidth = 595.28; // A4 standard width in points
    let pageHeight = 841.89; // A4 standard height in points

    if (pageSize === 'letter') {
      pageWidth = 612;
      pageHeight = 792;
    } else if (pageSize === 'fit') {
      pageWidth = imgWidth + marginPt * 2;
      pageHeight = imgHeight + marginPt * 2;
    }

    // Handle orientation
    if (orientation === 'landscape' && pageWidth < pageHeight) {
      const temp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = temp;
    } else if (orientation === 'auto') {
      if (imgWidth > imgHeight && pageWidth < pageHeight) {
        const temp = pageWidth;
        pageWidth = pageHeight;
        pageHeight = temp;
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Calculate scaled dimensions to preserve aspect ratio within margins
    const availWidth = pageWidth - marginPt * 2;
    const availHeight = pageHeight - marginPt * 2;
    const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);

    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const drawX = marginPt + (availWidth - drawWidth) / 2;
    const drawY = marginPt + (availHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });
  }

  const outputFileName = `images-to-pdf-${Date.now()}-${uuidv4().slice(0, 8)}.pdf`;
  const outputPath = path.join(OUTPUT_DIR, outputFileName);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  return {
    filename: outputFileName,
    path: outputPath,
    size: pdfBytes.length,
    pageCount: pdfDoc.getPageCount(),
  };
}

// 3. Scan to PDF (Camera capture / scanned images with enhancement filter)
export async function scanToPdf(filePaths, filter = 'contrast') {
  const pdfDoc = await PDFDocument.create();

  for (const filePath of filePaths) {
    let pipeline = sharp(filePath);

    // Apply document enhancement filter
    if (filter === 'bw') {
      // Threshold high contrast black & white
      pipeline = pipeline.grayscale().threshold(140);
    } else if (filter === 'contrast') {
      // Contrast boost & sharpen document scan
      pipeline = pipeline.normalize().sharpen();
    }

    const enhancedBuffer = await pipeline.jpeg({ quality: 90 }).toBuffer();
    const embeddedImage = await pdfDoc.embedJpg(enhancedBuffer);

    // Standard A4 page
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const scale = Math.min(pageWidth / embeddedImage.width, pageHeight / embeddedImage.height);
    const drawWidth = embeddedImage.width * scale;
    const drawHeight = embeddedImage.height * scale;
    const drawX = (pageWidth - drawWidth) / 2;
    const drawY = (pageHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight,
    });
  }

  const outputFileName = `scanned-doc-${Date.now()}-${uuidv4().slice(0, 8)}.pdf`;
  const outputPath = path.join(OUTPUT_DIR, outputFileName);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  return {
    filename: outputFileName,
    path: outputPath,
    size: pdfBytes.length,
    pageCount: pdfDoc.getPageCount(),
  };
}
