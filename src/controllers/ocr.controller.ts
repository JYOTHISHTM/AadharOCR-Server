import { Request, Response, NextFunction } from 'express';
import { performOcr } from '../services/ocr.service';
import { extractAadhaarData } from '../utils/parsers';

export async function runOcrController(req: Request, res: Response, next: NextFunction) {
  try {
    const frontFile = (req.files as any)?.front?.[0];
    const backFile = (req.files as any)?.back?.[0];

    if (!frontFile || !backFile) {
      return res.status(400).json({ error: 'Both front and back images are required (fields: front, back).' });
    }

    // Run OCR on both images
    const [frontText, backText] = await Promise.all([
      performOcr(frontFile.buffer),
      performOcr(backFile.buffer)
    ]);

    const extracted = extractAadhaarData(frontText, backText);

    res.json({
      rawText: { front: frontText, back: backText },
      extracted
    });
  } catch (err) {
    next(err);
  }
}
