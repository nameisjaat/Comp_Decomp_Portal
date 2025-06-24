import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CompressionContext } from "../context/CompressionContext";
import { motion } from "framer-motion";

import "./Home.css";

const algorithmDescriptions = {
  huffman:
    "Huffman Coding is a lossless data compression algorithm that assigns shorter codes to more frequent symbols.",
  rle:
    "Run-Length Encoding compresses data by representing consecutive repeating values as a single value and count.",
  lz77:
    "LZ77 is a sliding window compression method that replaces repeated occurrences with references to a single copy."
};

const Home = () => {
  const [file, setFile] = useState(null);
  const [algorithm, setAlgorithm] = useState("select");
  const [loading, setLoading] = useState(false);
  const { setResult } = useContext(CompressionContext);
  const [desc, setDesc] = useState("");
  const navigate = useNavigate();

 
  const handleAlgo = (e) => {
    const selected = e.target.value;
    setAlgorithm(selected);
    setDesc(algorithmDescriptions[selected]);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("myfile", file);

    setLoading(true);
    try {
      const res = await fetch(`https://comp-decomp-portal-1.onrender.com/api/compress/${algorithm}`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      setResult({
        originalSize: data.originalSize,
        compressedSize: data.compressedSize,
        compressionRatio: data.compressionRatio,
        downloadPath: data.downloadPath,
        algorithm: algorithm
      });

      if (data.downloadPath) {
        navigate("/results");
      } else {
        alert("Compression failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploader-container" >
      <motion.div
        className="intro"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>🚀 Compression and Decompression Portal</h1>
        <h2>
          Developed by <span>Garvit Choudhary</span>
        </h2>
        <p>
          Welcome to your all-in-one file compression tool — powered by Huffman, RLE, and LZ77.
          Upload any file, choose a method, and get a smaller version instantly with full stats and download options.
        </p>
      </motion.div>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <input type="file" onChange={handleFileChange} className="file-input" />

        <select className="select-algo" value={algorithm} onChange={handleAlgo}>
          <option value="select">Select an option</option>
          <option value="huffman">Huffman Coding</option>
          <option value="rle">Run-Length Encoding (RLE)</option>
          <option value="lz77">LZ77</option>
        </select>
        <p>{desc}</p>

        <button className="upload-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Compressing..." : "Compress & View Results"}
        </button>
      </motion.div>
    </div>
  );
};

export default Home;
