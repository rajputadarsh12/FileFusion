import * as imageService from '../services/imageService.js';

export async function compress(req, res, next) {
  try {
    const file = req.file || (req.files && req.files[0]);
    if (!file) {
      return res.status(400).json({ success: false, error: 'Please upload an image to compress.' });
    }
    const { quality, maxWidth } = req.body;
    const result = await imageService.compressImage(file.path, quality, maxWidth);
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}

export async function toPdf(req, res, next) {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length === 0) {
      return res.status(400).json({ success: false, error: 'Please upload at least one image.' });
    }
    const { pageSize, orientation, margin } = req.body;
    const result = await imageService.imagesToPdf(
      files.map((f) => f.path),
      pageSize,
      orientation,
      margin
    );
    res.json({ success: true, ...result, downloadUrl: `/api/download/${result.filename}` });
  } catch (err) {
    next(err);
  }
}
