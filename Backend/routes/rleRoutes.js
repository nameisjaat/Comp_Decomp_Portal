import express from "express";
import multer from "multer";
import path from "path";
import {
  compressWithRLE,
  decompressWithRLE,
} from "../controllers/rleController.js";

const rleRouter = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Routes
rleRouter.post("/compress/rle", upload.single("myfile"), compressWithRLE);
rleRouter.post("/decompress/rle", upload.single("myfile"), decompressWithRLE);

export { rleRouter };
