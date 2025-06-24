import express from "express";
import multer from "multer";
import { compressWithHuffman } from "../controllers/uploadcontroller.js";

const uploadRouter = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// POST /api/compress/huffman
uploadRouter.post("/compress/huffman", upload.single("myfile"), compressWithHuffman);

export { uploadRouter };
