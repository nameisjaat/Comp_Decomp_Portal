import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import CompressionContextProvider from './context/CompressionContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <CompressionContextProvider>
        <App/>
      </CompressionContextProvider>
  </BrowserRouter>
    
  
)
