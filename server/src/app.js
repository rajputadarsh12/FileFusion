import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiLimiter } from './middleware/security.js';
import pdfRoutes from './routes/pdfRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import docRoutes from './routes/docRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiting
app.use('/api/', apiLimiter);

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'FileFusion API Server',
    version: '1.0.0',
    uptime: Math.round(process.uptime()),
  });
});

// Mount Routes
app.use('/api/pdf', pdfRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/document', docRoutes);
app.use('/api/download', downloadRoutes);

// Serve APK & public downloads
app.use('/downloads', express.static(path.join(__dirname, '../public/downloads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.apk')) {
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader('Content-Disposition', 'attachment; filename="FileFusion.apk"');
    }
  },
}));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler (Never leaks internal stack traces or server file paths)
app.use((err, req, res, next) => {
  console.error('[FileFusion Server Error]', err.message);
  
  const statusCode = err.status || 500;
  const userMessage = err.message || 'An unexpected error occurred while processing the file.';
  
  res.status(statusCode).json({
    success: false,
    error: userMessage,
  });
});

export default app;
