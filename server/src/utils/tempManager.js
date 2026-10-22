import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base uploads directory in server root
export const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
export const OUTPUT_DIR = path.resolve(__dirname, '../../uploads/outputs');

// Ensure directories exist
export function initDirectories() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// Clean up files older than maxAgeMinutes
export function cleanupOldFiles(maxAgeMinutes = 60) {
  try {
    const now = Date.now();
    const maxAgeMs = maxAgeMinutes * 60 * 1000;

    const cleanDir = (dir) => {
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        try {
          const stats = fs.statSync(fullPath);
          if (stats.isDirectory()) {
            cleanDir(fullPath);
            // Remove empty subdirectories if older than maxAge
            if (fs.readdirSync(fullPath).length === 0 && now - stats.mtimeMs > maxAgeMs) {
              fs.rmdirSync(fullPath);
            }
          } else if (now - stats.mtimeMs > maxAgeMs) {
            fs.unlinkSync(fullPath);
          }
        } catch (e) {
          // ignore single file errors during cleanup
        }
      }
    };

    cleanDir(UPLOAD_DIR);
  } catch (err) {
    console.error('Error during scheduled temp cleanup:', err.message);
  }
}

// Safely resolve and verify that a file path is within allowed directories
export function safeResolvePath(baseDir, relativePath) {
  const resolved = path.resolve(baseDir, relativePath);
  if (!resolved.startsWith(path.resolve(baseDir))) {
    throw new Error('Access denied: Path traversal detected.');
  }
  return resolved;
}

// Delete specific file safely
export function safeDeleteFile(filePath) {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.warn(`Could not delete temp file ${filePath}:`, err.message);
  }
}
