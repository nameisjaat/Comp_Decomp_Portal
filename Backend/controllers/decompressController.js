import fs from "fs";
import path from "path";

// Node class for Huffman decoding
class HuffmanNode {
  constructor(char = null, left = null, right = null) {
    this.char = char;
    this.left = left;
    this.right = right;
  }
}

// Rebuild Huffman tree from code map
function buildTreeFromMap(codeMap) {
  const root = new HuffmanNode();
  for (const char in codeMap) {
    let node = root;
    const code = codeMap[char];
    for (let bit of code) {
      node = bit === "0"
        ? (node.left = node.left || new HuffmanNode())
        : (node.right = node.right || new HuffmanNode());
    }
    node.char = char;
  }
  return root;
}

// Convert buffer to full bitstring
function bufferToBitString(buffer) {
  return [...buffer].map(b => b.toString(2).padStart(8, '0')).join('');
}

// Decode bitstring using Huffman tree
function decode(bitString, tree) {
  let node = tree;
  const output = [];

  for (let bit of bitString) {
    node = bit === "0" ? node.left : node.right;
    if (node.char !== null) {
      output.push(parseInt(node.char)); // restore byte
      node = tree;
    }
  }

  return Buffer.from(output);
}

export const decompressHuffman = (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("No file uploaded");

  const inputPath = path.join("uploads", file.filename);
  const { name } = path.parse(file.filename); // filename without extension

  // Match pattern from compress logic
  const match = file.filename.match(/^\d+-compressed-(\d+)(\..+)$/);
  if (!match) {
    return res.status(400).json({
      error: "Invalid filename format",
      filename: file.filename
    });
  }

  const timestamp = match[1];
  const suffix = match[2]; // full original filename (e.g., ".jpg")

  const codeMapPath = path.join("output", `codes-compressed-${timestamp}${suffix}.json`);
  console.log("Looking for Huffman code map at:", codeMapPath);

  if (!fs.existsSync(codeMapPath)) {
    return res.status(400).json({ error: "Huffman code map not found" });
  }

  // Read compressed buffer
  const compressedBuffer = fs.readFileSync(inputPath);
  const bitString = bufferToBitString(compressedBuffer);

  // Load code map + extension
  const { codes, originalExtension } = JSON.parse(fs.readFileSync(codeMapPath, "utf-8"));

  const tree = buildTreeFromMap(codes);
  const decodedBuffer = decode(bitString, tree);

 // Final output path
const outputPath = path.join("output", `decompressed-${name}${suffix}`);
fs.writeFileSync(outputPath, decodedBuffer);

res.json({
  message: "File decompressed successfully",
  output: `/output/${path.basename(outputPath)}`
});

};
