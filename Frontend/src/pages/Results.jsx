import React, { useContext, useState } from "react";
import { CompressionContext } from "../context/CompressionContext";
import { motion } from "framer-motion";
import "./Results.css";

const Results = () => {
  const { result } = useContext(CompressionContext);
  const [decompressResult, setDecompressResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!result) return <p>No compression result available</p>;

  const handleDecompress = async () => {
    try {
      setLoading(true);
      const fileResponse = await fetch(`http://localhost:4000${result.downloadPath}`);
      const blob = await fileResponse.blob();
      const filename = result.downloadPath.split("/").pop();
      const file = new File([blob], filename, { type: blob.type });

      const formData = new FormData();
      formData.append("myfile", file);

      const res = await fetch(`http://localhost:4000/api/decompress/${result.algorithm}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.output) setDecompressResult(data.output);
      else alert("Decompression failed.");
    } catch (err) {
      console.error(err);
      alert("An error occurred during decompression.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filePath, isForcedTxt = true) => {
    try {
      const res = await fetch(`http://localhost:4000${filePath}`);
      const blob = await res.blob();
      let filename = filePath.split("/").pop();

      if (isForcedTxt) {
        const baseName = filename.replace(/\.[^/.]+$/, "");
        filename = `${baseName}.txt`;
      }

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <motion.div
      className="results-wrapper"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="results-card glass">
        <h1>📊 Compression Summary</h1>
        <div className="stat-grid">
          <div className="stat-block">
            <h2>🔧 Algorithm</h2>
            <p>{result.algorithm.toUpperCase()}</p>
          </div>
          <div className="stat-block">
            <h2>📂 Original Size</h2>
            <p>{result.originalSize} bytes</p>
          </div>
          <div className="stat-block">
            <h2>📦 Compressed Size</h2>
            <p>{result.compressedSize} bytes</p>
          </div>
          <div className="stat-block">
            <h2>⚡ Ratio</h2>
            <p>{result.compressionRatio}</p>
          </div>
        </div>

        <div className="result-actions">
          <button onClick={() => handleDownload(result.downloadPath)} className="action-btn">
            📥 Download Compressed
          </button>

          <button onClick={handleDecompress} className="action-btn" disabled={loading}>
            {loading ? "Decompressing..." : "🧩 Decompress"}
          </button>
        </div>

        {decompressResult && (
          <div className="result-actions">
            <button onClick={() => handleDownload(decompressResult, false)} className="action-btn">
              🎉 Download Decompressed
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Results;
