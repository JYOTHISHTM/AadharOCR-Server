import Tesseract from 'tesseract.js';

export async function performOcr(imageBuffer: Buffer): Promise<string> {
  try {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: m => console.log(m) 
    });
    return text || '';
  } catch (err) {
    console.error('Tesseract OCR error:', err);
    throw new Error('OCR processing failed');
  }
}


