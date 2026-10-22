# FileFusion — One Workspace. Every File Solution.

**FileFusion** is a modern, responsive, all-in-one web application that provides comprehensive PDF, image, Word, Excel, PowerPoint, and document-processing utilities in one unified platform.

Inspired by the utility of tools like iLovePDF and Smallpdf, FileFusion introduces an original brand identity, clean modern SaaS styling, authentic processing engines (zero mock/simulated downloads), and rigorous privacy safeguards.

---

## 🚀 Key Features & Highlights

- **32 Functional Tools:** Real conversion, compression, organization, editing, security, scanning, and AI document tools.
- **Genuine Processing Engines:** Powered by `pdf-lib`, `sharp`, `docx`, `pptxgenjs`, `xlsx`, `mammoth`, `jspdf`, and `tesseract.js`.
- **Interactive PDF Viewers:** Built-in signature pad (draw/type/upload), interactive canvas annotator, visual page organizer, and side-by-side comparison.
- **Automatic Sandbox Isolation & Temp Cleanup:** Uploads are isolated with cryptographic UUIDs and automatically purged within 60 minutes via scheduled background workers.
- **Security & Privacy:** Server-side MIME validation, path traversal guards, and strict SSRF protection preventing access to private networks.
- **Modern Responsive Design:** Crafted with React 18, Vite, Tailwind CSS, Lucide icons, and light/dark theme support.
- **Full Test Suite:** Comprehensive automated test coverage for API endpoints and conversion pipelines.

---

## 📁 32 Utilities by Category

### 1. PDF Organization
1. **Merge PDF** (`/tool/merge-pdf`): Combine multiple PDFs with drag-and-drop reordering.
2. **Split PDF** (`/tool/split-pdf`): Extract custom page ranges (`1-3, 5`) or split every page into a ZIP archive.
3. **Organize PDF** (`/tool/organize-pdf`): Visual thumbnail grid to reorder, rotate (90°/180°/270°), duplicate, and delete pages.
4. **Rotate PDF** (`/tool/rotate-pdf`): Rotate all pages, odd/even, or specific pages by 90°, 180°, or 270°.
5. **Crop PDF** (`/tool/crop-pdf`): Trim margins or set custom crop boundaries.
6. **Compare PDF** (`/tool/compare-pdf`): Side-by-side document inspection with textual difference detection.

### 2. PDF Compression & Repair
7. **Compress PDF** (`/tool/compress-pdf`): Low, Medium, and High compression presets with before/after statistics and byte savings.
8. **Repair PDF** (`/tool/repair-pdf`): Parse damaged PDFs, reconstruct cross-reference tables, and recover readable streams.

### 3. PDF Conversion
9. **PDF to Word** (`/tool/pdf-to-word`): Convert PDF into editable `.docx` files preserving headings and layout.
10. **PDF to PowerPoint** (`/tool/pdf-to-powerpoint`): Transform PDF pages into `.pptx` presentations.
11. **PDF to Excel** (`/tool/pdf-to-excel`): Extract structured tables into `.xlsx` with interactive table preview.
12. **PDF to JPG** (`/tool/pdf-to-jpg`): Export PDF pages as high-resolution JPG or PNG images (150/300 DPI).
13. **PDF to PDF/A** (`/tool/pdf-to-pdfa`): Standardize documents to ISO PDF/A archival format with conformance validation.

### 4. Convert Documents to PDF
14. **Word to PDF** (`/tool/word-to-pdf`): Convert `.docx` / `.doc` files to PDF.
15. **PowerPoint to PDF** (`/tool/powerpoint-to-pdf`): Convert `.pptx` slide decks into PDF.
16. **Excel to PDF** (`/tool/excel-to-pdf`): Convert `.xlsx` / `.xls` spreadsheets into cleanly formatted, paginated PDFs.
17. **Image to PDF** (`/tool/jpg-to-pdf`): Bundle JPG, PNG, and WebP images into a single PDF with custom page size and orientation.
18. **HTML to PDF** (`/tool/html-to-pdf`): Render HTML code or public URLs into PDF with SSRF protection.

### 5. PDF Editing
19. **Edit PDF** (`/tool/edit-pdf`): Add text annotations, shapes, and custom colored boxes.
20. **Sign PDF** (`/tool/sign-pdf`): Draw signature, type with cursive handwriting fonts, or upload signature image.
21. **Watermark PDF** (`/tool/watermark-pdf`): Stamp custom text or image watermarks with angle and opacity control.
22. **Page Numbers** (`/tool/add-page-numbers`): Number headers or footers with configurable placement and format.
23. **PDF Forms** (`/tool/pdf-forms`): Inspect and fill interactive AcroForm fields.
24. **Redact PDF** (`/tool/redact-pdf`): Permanently scrub sensitive text and place opaque redaction markers.

### 6. PDF Security
25. **Protect PDF** (`/tool/protect-pdf`): Encrypt PDF with password protection.
26. **Unlock PDF** (`/tool/unlock-pdf`): Decrypt authorized password-protected documents.

### 7. Advanced PDF Tools
27. **Scan to PDF** (`/tool/scan-to-pdf`): Capture paper documents with webcam or camera, apply contrast/B&W filters, and compile into PDF.
28. **OCR PDF** (`/tool/ocr-pdf`): Optical Character Recognition for scanned pages supporting multiple languages (English, Spanish, French, German, Hindi) to TXT, DOCX, or PDF.

### 8. Image & File Size Tools
29. **Image Compressor** (`/tool/image-compressor`): Compress JPG, PNG, and WebP with quality sliders and dimension scaling.
30. **Document & File Size Optimizer** (`/tool/document-optimizer`): Optimize documents to explicit target limits (250 KB, 500 KB, 1 MB, 2 MB, or custom).

### 9. AI Document Tools
31. **AI Document Summarizer** (`/tool/ai-summarizer`): Generate concise, detailed, or bulleted summaries. Powered by an offline NLP frequency extractor + optional Google Gemini API.
32. **Translate PDF** (`/tool/translate-pdf`): Extract document text and translate into 10+ languages (Spanish, French, German, Hindi, Chinese, etc.).

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, React Router v6, React Dropzone
- **Backend:** Node.js, Express.js, Multer, Helmet, CORS, express-rate-limit, node-cron
- **Processing Libraries:** `pdf-lib`, `sharp`, `mammoth`, `docx`, `xlsx`, `pptxgenjs`, `jspdf`, `pdf-parse`, `archiver`
- **Testing:** Jest, Supertest

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+ (tested on Node v22.17.1)
- npm v9+

### 1. Install All Dependencies
From the root directory:
```bash
npm run install:all
```
*Or manually:*
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the `server` directory:
```bash
cp server/.env.example server/.env
```

Default contents:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
TEMP_DIR=uploads
CLEANUP_INTERVAL_MINUTES=30
FILE_RETENTION_MINUTES=60

# Optional: Add your Gemini API key to enable enhanced AI summarization & translation
GEMINI_API_KEY=
```

---

## 🏃 Running the Application

### Option A: Run Both Client & Server Concurrently
From the root directory:
```bash
npm run dev
```

### Option B: Run Server and Client Separately

**Start the Backend API Server:**
```bash
npm run server
# Running at http://localhost:5000
```

**Start the Frontend Vite Dev Server:**
```bash
npm run client
# Running at http://localhost:5173
```

Open your browser at **`http://localhost:5173`**.

---

## 🧪 Running Automated Tests

Run the backend integration test suite:
```bash
npm test
```
*Or from inside `server/`:*
```bash
cd server && npm test
```

All 17 automated tests cover health checks, PDF merge, split, compression, rotation, watermarking, page numbers, PDF to Word, PDF to Excel, PDF to PowerPoint, PDF to PDF/A, image compression, image to PDF, AI summarizer, encryption/decryption, path traversal defense, and SSRF security.

---

## 🛡️ Security Architecture

1. **Path Traversal Protection:** The `/api/download/:filename` endpoint validates all requested filenames against directory escape sequences (`..`, `/`, `\`).
2. **SSRF Guard:** The HTML-to-PDF engine validates all incoming URLs against private IPv4/IPv6 ranges (e.g. `127.0.0.1`, `10.x.x.x`, `192.168.x.x`, and cloud metadata IP `169.254.169.254`).
3. **Sandbox Purge Worker:** `node-cron` sweeps the `uploads/` directory every 30 minutes, permanently deleting files older than 60 minutes.
4. **No Plaintext Passwords:** Passwords used in Protect/Unlock PDF are processed in memory and never logged or stored.
5. **Rate Limiting:** API requests are limited to 120 requests per 15 minutes per IP address.

---

## 📦 Production Build

To build the client for production:
```bash
npm run build
```
The optimized static output will be located in `client/dist/` ready to be served by any static host or via Express `express.static()`.
