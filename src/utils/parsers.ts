// Simple heuristics to parse Aadhaar details from OCR text.

function clean(text: string) {
  return text.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\r/g, '');
}

function linesOf(text: string) {
  return clean(text).split('\n').map(l => l.trim()).filter(Boolean);
}

function extractAadhaarNumber(text: string): string | undefined {
  const m = clean(text).match(/(?:^|\D)(\d{4}\s?\d{4}\s?\d{4})(?:\D|$)/);
  if (!m) return;
  return m[1].replace(/\s+/g, '');
}

function extractDob(text: string): string | undefined {
  const t = clean(text);
  let m = t.match(/(?:DOB|Date of Birth|DoB)[:\s-]*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i);
  if (m) return m[1].replace(/-/g, '/');
  m = t.match(/Year of Birth[:\s-]*(\d{4})/i);
  if (m) return m[1];
  return;
}

function extractGender(text: string): string | undefined {
  const m = clean(text).match(/\b(MALE|FEMALE|F|M)\b/i);
  if (!m) return;
  const g = m[1].toUpperCase();
  if (g === 'M') return 'MALE';
  if (g === 'F') return 'FEMALE';
  return g;
}

function isProbableName(line: string) {
  if (!line) return false;
  if (/(GOVERNMENT|UNIQUE IDENTIFICATION|INDIA|AUTHORITY|UIDAI|AADHAAR|OF)/i.test(line)) return false;
  if (/[0-9]/.test(line)) return false;

  const words = line.split(/\s+/);
  // must contain at least one word with >=3 letters
  const hasGoodWord = words.some(w => w.length >= 3 && /[A-Za-z]/.test(w));
  if (!hasGoodWord) return false;

  // reject if all letters are lowercase
  if (line === line.toLowerCase()) return false;

  return true;
}

function extractName(frontText: string): string | undefined {
  const arr = linesOf(frontText);

  const dobIdx = arr.findIndex(l => /(DOB|Date of Birth|DoB)/i.test(l));
  const genderIdx = arr.findIndex(l => /\b(MALE|FEMALE|M|F)\b/i.test(l));
  const aadhaarIdx = arr.findIndex(l => /\d{4}\s?\d{4}\s?\d{4}/.test(l));
  const anchorIdx = [dobIdx, genderIdx, aadhaarIdx].filter(i => i >= 0).sort((a,b)=>a-b)[0];
  const searchEnd = anchorIdx >= 0 ? anchorIdx : arr.length;

  let candidate: string | undefined;
  for (let i = 0; i < searchEnd; i++) {
    if (isProbableName(arr[i])) {
      candidate = arr[i]; // keep last valid line before DOB
    }
  }

  if (!candidate) return undefined;
  // Clean up leading single characters like "g " or "G "
  return candidate.replace(/^[A-Z]\s+/i, '').toUpperCase();
}

function isProbableAddressLine(line: string) {
  if (!line) return false;
  if (/(UIDAI|GOVERNMENT|INDIA|AUTHORITY|WWW\.|HELP@|VID\b|1947)/i.test(line)) return false;

  // reject very short lines with no digits (like "Sa 2")
  if (line.replace(/[^A-Za-z]/g, '').length < 3 && !/\d{6}/.test(line)) return false;

  // reject if mostly garbage symbols
  const alphaRatio = line.replace(/[^A-Za-z]/g, '').length / line.length;
  if (alphaRatio < 0.3 && !/\d{6}/.test(line)) return false;

  return true;
}


function cleanAddressText(line: string) {
  return line
    .replace(/^[^A-Za-z0-9]+/, '')   // trim leading junk
    .replace(/[^A-Za-z0-9,\-\s]/g, '') // remove %, =, weird chars
    .replace(/\s+/g, ' ')             // normalize spaces
    .trim();
}

const garbageWords = ["EELS", "GER", "MARL", "BATTY", "RIE", "SA"];
function normalizeAddress(address: string): string {
  return address
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 3)
    .filter(p => !/[%=]/.test(p))
    .filter(p => !garbageWords.some(g => p.toUpperCase().includes(g)))  // <<< remove junk
    .map(p => p.replace(/\s+/g, ' '))
    .map(p => p.toUpperCase())
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(', ');
}


function extractAddress(backText: string): string | undefined {
  const arr = linesOf(backText);
  let start = arr.findIndex(l => /Address|To\b/i.test(l));
  if (start === -1) {
    start = Math.floor(arr.length / 3);
  } else {
    start += 1;
  }

  const acc: string[] = [];
  for (let i = start; i < arr.length; i++) {
    let line = arr[i];
    if (!isProbableAddressLine(line)) continue;

    line = cleanAddressText(line);
    if (!line) continue;

    acc.push(line);
    if (/\b\d{6}\b/.test(line)) break;
  }

  if (!acc.length) return undefined;

  const address = acc.join(', ');
  return normalizeAddress(address);  // <<< APPLY CLEANUP HERE
}



export function extractAadhaarData(frontText: string, backText: string) {
  const aadhaarNumber = extractAadhaarNumber(frontText) || extractAadhaarNumber(backText);
  const name = extractName(frontText);
  const dob = extractDob(frontText) || extractDob(backText);
  const gender = extractGender(frontText) || extractGender(backText);
  const address = extractAddress(backText);
  return { aadhaarNumber, name, dob, gender, address };
}
