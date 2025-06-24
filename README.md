# 📦 Data Compression and Decompression Portal

Welcome to the **Data Compression and Decompression Portal** — a full-stack web application that enables users to upload files, compress them using industry-standard algorithms like Huffman Coding, Run-Length Encoding (RLE), and LZ77, and then decompress them back to their original form.
Built with performance and clarity in mind, this app allows users to reduce file sizes, analyze compression statistics, and download results easily through an interactive and modern UI.

---

## LIVE URL : https://comp-decomp-portal.vercel.app/

## ✨ Features

- 🔼 **File Upload**: Upload any file type (text, image, binary).
- 📉 **Compression**: Compress files using:
  - Huffman Coding
  - Run-Length Encoding (RLE)
  - LZ77
- 🔁 **Decompression**: Restore files to their original state (same extension maintained).
- 📊 **Compression Statistics**:
  - Original size
  - Compressed size
  - Compression ratio
- 💾 **Download Files**: One-click download for compressed and decompressed files.
- 📚 **Algorithm Info**: Brief educational descriptions shown for selected algorithms.
- ❌ **Error Handling**: User-friendly error messages for invalid uploads or decompression issues.
- 💡 **Animated UI**: Beautiful React frontend with animated backgrounds (Vanta.js) and transitions (Framer Motion).
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop.

---

## 🛠 Tech Stack

### Frontend
- React.js
- CSS (Glassmorphism + Responsive Design)
- Framer Motion
- Vanta.js (Waves background)

### Backend
- Node.js
- Express.js
- Multer (for file upload handling)
- File System (`fs`)
- Custom Huffman, RLE, LZ77 implementations in JS

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
Make sure you have:
- Node.js installed (v16+)
- npm or yarn

---

## 📦 Backend Setup

```bash
# 1. Navigate to the backend folder
cd Backend

# 2. Install backend dependencies
npm install express cors dotenv multer path

# 3. Start the server
npm run dev
# Server runs on: https://comp-decomp-portal-1.onrender.com


## 🪄Frontend Setup
# 1. Navigate to the frontend folder
cd Frontend

# 2. Install frontend dependencies
npm create vite@latest
npm install react-router-dom framer-motion 

# 3. Start the React development server
npm start
# App will be served at: https://comp-decomp-portal.vercel.app/
