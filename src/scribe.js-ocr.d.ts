declare module 'scribe.js-ocr' {
  interface ScribeOcrResult {
    text: string;
    // Add other properties from the result if known, e.g., confidence, pages
  }
  interface ScribeOcr {
    extractText(files: (File | string)[], options?: any): Promise<ScribeOcrResult | ScribeOcrResult[] | string>; // Adjusted to include string for flexibility
  }
  const scribe: ScribeOcr;
  export default scribe;
}
