# Aadhaar OCR Backend (Node + Express + TypeScript + Google Vision)

## Quick Start
1) Install dependencies:
   ```bash
   npm install
   ```
2) Copy `.env.example` to `.env` and set values:
   - `PORT=5000`
   - `CLIENT_ORIGIN=http://localhost:5173`
   - Set Google credentials:
     - Preferred: `GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json`
       (This environment variable is read by Google SDK automatically.)
     - Or: `KEYFILE=/absolute/path/to/service-account.json` (the app will pass it explicitly).

3) Start in dev:
   ```bash
   npm run dev
   ```

4) Build + run:
   ```bash
   npm run build
   npm start
   ```

## API
- **POST** `/api/ocr` (multipart/form-data)
  - fields: `front` (image), `back` (image), both required
  - returns: JSON with `rawText` and `extracted` fields

## Security & Privacy
- No images or text are stored server-side. All processing is in-memory.
- Ensure you comply with local laws/regulations before processing real IDs.
