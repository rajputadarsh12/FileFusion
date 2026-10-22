import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_DIR, initDirectories } from '../utils/tempManager.js';

initDirectories();

// Secure disk storage with uuid prefix to prevent collision and unsafe filenames
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Sanitize original filename (keep only alphanumeric, dash, dot, underscore)
    const sanitizedExt = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
    const cleanBase = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);
    const uniqueName = `${Date.now()}-${uuidv4().slice(0, 8)}-${cleanBase}${sanitizedExt}`;
    cb(null, uniqueName);
  },
});

// File filter to prevent executable files (.exe, .bat, .sh, .cmd, .php, etc.)
const fileFilter = (req, file, cb) => {
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.php', '.phtml', '.vbs', '.js', '.jar', '.com', '.scr', '.msi'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (dangerousExtensions.includes(ext)) {
    return cb(new Error(`File type ${ext} is blocked for security reasons.`), false);
  }
  cb(null, true);
};

// 100MB maximum file size limit
export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 20, // Max 20 files at once
  },
  fileFilter,
});
