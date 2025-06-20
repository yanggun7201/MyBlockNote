import React, { useState, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import scribe from '../../node_modules/scribe.js-ocr/scribe.js'; // Using explicit path

const OcrPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOcrText('');
      setError('');
      setIsLoading(false);
    } else {
      setSelectedFile(null);
    }
  };

  const handleExtractText = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }
    setIsLoading(true);
    setOcrText('');
    setError('');

    try {
      console.log(`Attempting OCR with scribe.js-ocr for file: ${selectedFile.name}`);
      // The library expects an array of files.
      const result = await scribe.extractText([selectedFile]);
      console.log('Scribe.js-ocr raw result:', result);

      let extractedText = '';
      if (result) {
        // Based on the .d.ts, result could be ScribeOcrResult, ScribeOcrResult[], or string
        if (Array.isArray(result) && result.length > 0) {
          // Assuming the first element is what we want if it's an array
          if (typeof result[0] === 'string') {
            extractedText = result[0];
          } else if (result[0] && typeof result[0].text === 'string') {
            extractedText = result[0].text;
          }
        } else if (typeof result === 'object' && result !== null && 'text' in result) {
          extractedText = (result as { text: string }).text; // Cast to access .text
        } else if (typeof result === 'string') {
          extractedText = result;
        }
      }

      setOcrText(extractedText || 'No text extracted or unexpected result format.');

    } catch (e: any) {
      console.error('Error during OCR processing with scribe.js-ocr:', e);
      setError(`OCR Error: ${e.message || 'Unknown error during processing. Check console and ensure scribe.js-ocr is correctly configured and its assets are served.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>OCR Page - Scribe.js OCR</h1>
      <div style={{ marginBottom: '15px' }}>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          disabled={isLoading}
          style={{ marginRight: '10px' }}
        />
        <button
          onClick={handleExtractText}
          disabled={isLoading || !selectedFile}
          style={{ padding: '8px 15px' }}
        >
          {isLoading ? 'Processing with Scribe.js OCR...' : 'Extract Text with Scribe.js OCR'}
        </button>
      </div>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '8px 15px' }}>Go to Home</button>
        </Link>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: '10px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {isLoading && !ocrText && !error && (
         <div style={{ marginTop: '20px' }}>
           <p>Processing image with Scribe.js OCR...</p>
         </div>
      )}

      {ocrText && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
          <h2>Extracted Text:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: '1.5' }}>{ocrText}</pre>
        </div>
      )}
    </div>
  );
};

export default OcrPage;
