import fs from "fs";
import path from "path";

// Node for Huffman tree
class HuffmanNode {
  constructor(char, freq) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

// Comparator for priority queue
const compare = (a, b) => a.freq - b.freq;

// Build Huffman Tree and generate codes
function buildHuffmanTree(buffer) {
  const freqMap = {};
  for (let byte of buffer) {
    const char = byte.toString();
    freqMap[char] = (freqMap[char] || 0) + 1;
  }

  const pq = Object.entries(freqMap).map(
    ([char, freq]) => new HuffmanNode(char, freq)
  );
  pq.sort(compare);

  while (pq.length > 1) {
    const left = pq.shift();
    const right = pq.shift();
    const merged = new HuffmanNode(null, left.freq + right.freq);
    merged.left = left;
    merged.right = right;
    pq.push(merged);
    pq.sort(compare);
  }

  return pq[0]; // Root node
}

function generateCodes(root, code = "", map = {}) {
  if (!root) return;
  if (root.char !== null) map[root.char] = code;
  generateCodes(root.left, code + "0", map);
  generateCodes(root.right, code + "1", map);
  return map;
}

function encodeBuffer(buffer, codes) {
  let bitString = "";
  for (let byte of buffer) {
    bitString += codes[byte.toString()];
  }

  // Convert bitString to bytes
  const byteArray = [];
  for (let i = 0; i < bitString.length; i += 8) {
    const byte = bitString.substring(i, i + 8);
    byteArray.push(parseInt(byte.padEnd(8, "0"), 2));
  }

  return Buffer.from(byteArray);
}

export const compressWithHuffman = (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  const inputPath = path.join("uploads", file.filename);
  const originalExtension = path.extname(file.originalname); // e.g., .jpg
  const fileBuffer = fs.readFileSync(inputPath);

  const root = buildHuffmanTree(fileBuffer);
  const codes = generateCodes(root);
  const encodedBuffer = encodeBuffer(fileBuffer, codes);

  // Save compressed file with same extension
  const compressedName = `compressed-${Date.now()}${originalExtension}`;
  const compressedPath = path.join("output", compressedName);
  fs.writeFileSync(compressedPath, encodedBuffer);

  // Save code map and metadata (extension)
  const metaPath = path.join("output", `codes-${compressedName}.json`);
  fs.writeFileSync(metaPath, JSON.stringify({
    codes,
    originalExtension
  }));

  res.json({
    message: "File compressed with Huffman coding",
    originalSize: fileBuffer.length,
    compressedSize: encodedBuffer.length,
    compressionRatio: ((1 - encodedBuffer.length / fileBuffer.length) * 100).toFixed(2) + "%",
    downloadPath: `/output/${compressedName}`,
    codeMap: `/output/codes-${compressedName}.json`
  });
};
