import fs from "fs";
import path from "path";

// Run-Length Encode (binary-safe)
function rleEncode(buffer) {
  const result = [];
  let i = 0;

  while (i < buffer.length) {
    let count = 1;
    while (i + count < buffer.length && buffer[i] === buffer[i + count] && count < 255) {
      count++;
    }
    result.push(count);
    result.push(buffer[i]);
    i += count;
  }

  return Buffer.from(result);
}

// Run-Length Decode
function rleDecode(buffer) {
  const result = [];
  for (let i = 0; i < buffer.length; i += 2) {
    const count = buffer[i];
    const value = buffer[i + 1];
    result.push(...Array(count).fill(value));
  }
  return Buffer.from(result);
}

// Compress with RLE
export const compressWithRLE = (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  const inputPath = path.join("uploads", file.filename);
  const originalExt = path.extname(file.originalname);
  const buffer = fs.readFileSync(inputPath);

  const encoded = rleEncode(buffer);
  const outputName = `rle-compressed-${Date.now()}${originalExt}`;
  const outputPath = path.join("output", outputName);

  fs.writeFileSync(outputPath, encoded);

  // Save metadata
  const metaPath = path.join("output", `rle-meta-${outputName}.json`);
  fs.writeFileSync(metaPath, JSON.stringify({ originalExt }));

  res.json({
    message: "File compressed using RLE",
    originalSize: buffer.length,
    compressedSize: encoded.length,
    compressionRatio: ((1 - encoded.length / buffer.length) * 100).toFixed(2) + "%",
    downloadPath: `/output/${outputName}`
  });
};

// Decompress with RLE
export const decompressWithRLE = (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  const inputPath = path.join("uploads", file.filename);
  const compressedBuffer = fs.readFileSync(inputPath);

  const match = file.filename.match(/^\d+-rle-compressed-(\d+)(\..+)$/);
  if (!match) {
    return res.status(400).json({ error: "Invalid RLE filename format", filename: file.filename });
  }

  const timestamp = match[1];
  const ext = match[2];

  const metaPath = path.join("output", `rle-meta-rle-compressed-${timestamp}${ext}.json`);
  if (!fs.existsSync(metaPath)) {
    return res.status(400).json({ error: "RLE metadata not found." });
  }

  const { originalExt } = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
  const decoded = rleDecode(compressedBuffer);

  const outputName = `rle-decompressed-${timestamp}${originalExt}`;
  const outputPath = path.join("output", outputName);
  fs.writeFileSync(outputPath, decoded);

  res.json({
    message: "File decompressed successfully using RLE",
    output: `/output/${outputName}`
  });
};
