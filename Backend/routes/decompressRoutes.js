// routes/decompressRoutes.js
import express from "express";
import multer from "multer";
import { decompressHuffman } from "../controllers/decompressController.js";

const decompressRouter = express.Router();

// Multer setup (same as uploadRoutes)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Route: POST /api/decompress/huffman
decompressRouter.post("/decompress/huffman", upload.single("myfile"), decompressHuffman);

export { decompressRouter };
