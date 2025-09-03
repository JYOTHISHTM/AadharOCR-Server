


import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ocrRouter } from './routes/ocr.routes'; // <- fixed
import { getEnv } from './config/env';

const app = express();
const { PORT, CLIENT_ORIGIN, NODE_ENV } = getEnv();

app.use(cors({ origin: CLIENT_ORIGIN || true, credentials: false }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: NODE_ENV || 'development' });
});

app.use('/api/ocr', ocrRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('[Error]', err?.message || err);
  res.status(err?.status || 500).json({ error: err?.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
