// Utility functions for file sizes and formatting

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0 || bytes === null || bytes === undefined) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function calculateSavings(originalBytes, newBytes) {
  if (!originalBytes || !newBytes) return { savedBytes: 0, percentage: 0 };
  const diff = originalBytes - newBytes;
  if (diff <= 0) return { savedBytes: 0, percentage: 0 };
  const percentage = Math.round((diff / originalBytes) * 100);
  return {
    savedBytes: diff,
    percentage: Math.min(percentage, 99),
  };
}

export function parseTargetSize(target) {
  if (!target) return null;
  if (typeof target === 'number') return target * 1024; // assumed KB
  const lower = target.toLowerCase().trim();
  if (lower.endsWith('mb')) {
    return parseFloat(lower.replace('mb', '')) * 1024 * 1024;
  }
  if (lower.endsWith('kb')) {
    return parseFloat(lower.replace('kb', '')) * 1024;
  }
  return parseFloat(lower);
}
