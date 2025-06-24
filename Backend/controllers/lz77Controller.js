import fs from "fs";
import path from "path";

// Encode with a simple LZ77 sliding window
function lz77Encode(buffer, windowSize = 255, lookAheadSize = 15) {
  const output = [];
  let i = 0;

  while (i < buffer.length) {
    let matchOffset = 0;
    let matchLength = 0;

    const windowStart = Math.max(0, i - windowSize);
    const window = buffer.slice(windowStart, i);

    for (let j = 1; j <= lookAheadSize && i + j <= buffer.length; j++) {
      const sequence = buffer.slice(i, i + j);
      const idx = window.indexOf(sequence);

      if (idx !== -1) {
        matchOffset = window.length - idx;
        matchLength = j;
      }
    }

    if (matchLength > 0) {
      const nextByte = buffer[i + matchLength] || 0;
      output.push(matchOffset, matchLength, nextByte);
      i += matchLength + 1;
    } else {
      output.push(0, 0, buffer[i]);
      i++;
    }
  }

  return Buffer.from(output);
}

// Decode LZ77
function lz77Decode(buffer) {
  const output = [];

  for (let i = 0; i < buffer.length; i += 3) {
    const offset = buffer[i];
    const length = buffer[i + 1];
    const nextByte = buffer[i + 2];

    const start = output.length - offset;
    for (let j = 0; j < length; j++) {
      output.push(output[start + j]);
    }
    output.push(nextByte);
  }

  return Buffer.from(output);
}

// Compress route
export const compressWithLZ77 = (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  const inputPath = path.join("uploads", file.filename);
  const buffer = fs.readFileSync(inputPath);
  const originalExt = path.extname(file.originalname);
  const encoded = lz77Encode(buffer);

  const outputName = `lz77-compressed-${Date.now()}${originalExt}`;
  const outputPath = path.join("output", outputName);
  fs.writeFileSync(outputPath, encoded);

  // Save metadata
  const metaPath = path.join("output", `lz77-meta-${outputName}.json`);
  fs.writeFileSync(metaPath, JSON.stringify({ originalExt }));

  res.json({
    message: "File compressed using LZ77",
    originalSize: buffer.length,
    compressedSize: encoded.length,
    compressionRatio: ((1 - encoded.length / buffer.length) * 100).toFixed(2) + "%",
    downloadPath: `/output/${outputName}`,
  });
};

// Decompress route
export const decompressWithLZ77 = (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  const inputPath = path.join("uploads", file.filename);
  const buffer = fs.readFileSync(inputPath);

  const match = file.filename.match(/^\d+-lz77-compressed-(\d+)(\..+)$/);
  if (!match) {
    return res.status(400).json({ error: "Invalid LZ77 filename format", filename: file.filename });
  }

  const timestamp = match[1];
  const ext = match[2];

  const metaPath = path.join("output", `lz77-meta-lz77-compressed-${timestamp}${ext}.json`);
  if (!fs.existsSync(metaPath)) {
    return res.status(400).json({ error: "LZ77 metadata not found." });
  }

  const { originalExt } = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const decoded = lz77Decode(buffer);

  const outputName = `lz77-decompressed-${timestamp}${originalExt}`;
  const outputPath = path.join("output", outputName);
  fs.writeFileSync(outputPath, decoded);

  res.json({
    message: "File decompressed using LZ77",
    output: `/output/${outputName}`
  });
};
