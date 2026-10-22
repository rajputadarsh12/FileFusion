// FileFusion Client API Service

const BASE_URL = ''; // Relative URL will hit Vite proxy (/api -> http://localhost:5000)

export async function checkServerHealth() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

export function executeToolJob({ endpoint, files, settings, textInput, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    // Attach files
    if (files && files.length > 0) {
      if (files.length === 1) {
        formData.append('file', files[0]);
      } else {
        files.forEach((f) => formData.append('files', f));
      }
    }

    // Attach text input if present (e.g. for HTML to PDF, Summarizer, Translator)
    if (textInput) {
      formData.append('text', textInput);
      formData.append('html', textInput);
      if (textInput.startsWith('http://') || textInput.startsWith('https://')) {
        formData.append('url', textInput);
      }
    }

    // Attach tool settings
    if (settings) {
      Object.entries(settings).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          if (typeof val === 'object') {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, String(val));
          }
        }
      });
    }

    // Progress handler
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 90); // reserve 10% for processing
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && response.success !== false) {
          if (onProgress) onProgress(100);
          resolve(response);
        } else {
          reject(new Error(response.error || `Server error (${xhr.status})`));
        }
      } catch (e) {
        reject(new Error(`Failed to parse server response: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during file transmission.'));
    });

    xhr.addEventListener('timeout', () => {
      reject(new Error('Request timed out. Please try with smaller files.'));
    });

    xhr.open('POST', `${BASE_URL}${endpoint}`);
    xhr.send(formData);
  });
}

export async function downloadFile(downloadUrl, defaultFilename = 'filefusion-result.pdf') {
  const url = `${BASE_URL}${downloadUrl}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to retrieve processed file from server.');
  }

  // Extract filename from header if available
  const disposition = response.headers.get('content-disposition');
  let filename = defaultFilename;
  if (disposition && disposition.includes('filename=')) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) filename = match[1];
  }

  const blob = await response.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);
}
