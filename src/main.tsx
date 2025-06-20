import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import OcrPage from './OcrPage.tsx'; // Make sure OcrPage.tsx has a default export

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ocr" element={<OcrPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
