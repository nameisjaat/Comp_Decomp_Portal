import express from "express";
import multer from "multer";
import {
  compressWithLZ77,
  decompressWithLZ77,
} from "../controllers/lz77Controller.js";

const lz77Router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

lz77Router.post("/compress/lz77", upload.single("myfile"), compressWithLZ77);
lz77Router.post("/decompress/lz77", upload.single("myfile"), decompressWithLZ77);

export { lz77Router };
