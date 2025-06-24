import express from "express"
import cors from "cors"
import 'dotenv/config'
import { uploadRouter } from "./routes/uploadRoutes.js";
import path from 'path'
import { decompressRouter } from "./routes/decompressRoutes.js";
import { rleRouter } from "./routes/rleRoutes.js";
import { lz77Router } from "./routes/lz77Routes.js";
// app config
const app = express();
const port = 4000;

//middleware
app.use(express.json());
app.use(cors());

//api endpoints
app.use("/uploads", express.static("uploads")); // to serve uploaded files
app.use("/api", uploadRouter);
app.use("/output", express.static("output")); // to serve compressed and decompressed files 
app.use("/api",decompressRouter) //  to decompress with Huffman
app.use("/api",rleRouter) //  to compress and decompress with 
app.use("/api",lz77Router)

app.get("/",(req,res)=>{
    res.send("API working")
})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`);
})

//upload controller contains huffman compression logic 
// decompress controller contains huffman decompression logic