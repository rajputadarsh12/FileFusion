import app from './app.js';
import cron from 'node-cron';
import { initDirectories, cleanupOldFiles } from './utils/tempManager.js';

const PORT = process.env.PORT || 5000;
const RETENTION_MINUTES = parseInt(process.env.FILE_RETENTION_MINUTES, 10) || 60;

// Initialize temp file storage directories
initDirectories();

// Initial cleanup on boot
cleanupOldFiles(RETENTION_MINUTES);

// Scheduled background job: Clean expired temp files every 30 minutes
cron.schedule('*/30 * * * *', () => {
  console.log('[FileFusion Maintenance] Running scheduled temporary file cleanup...');
  cleanupOldFiles(RETENTION_MINUTES);
});

// Start listening
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 FileFusion API Server is running on port ${PORT}`);
  console.log(`📡 Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`🛡️  Auto temp cleanup: Active (Retention: ${RETENTION_MINUTES} mins)`);
  console.log(`=======================================================`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});
