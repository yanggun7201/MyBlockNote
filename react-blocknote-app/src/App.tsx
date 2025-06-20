import React, { useRef } from "react";
import "@blocknote/core/style.css";
import "@blocknote/react/style.css";
import "./App.css"; // Import App.css
import { BlockNoteEditor } from "@blocknote/core";
import type { Block, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";

function App() {
  const editor: BlockNoteEditor | null = useCreateBlockNote({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = async () => {
    if (editor) {
      const blocks: Block[] = editor.document;
      const json = JSON.stringify(blocks, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "editor-content.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImportJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editor && event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (loadEvent) => {
        try {
          const jsonContent = loadEvent.target?.result;
          if (typeof jsonContent === "string") {
            const parsedBlocks: Block[] = JSON.parse(jsonContent);
            if (Array.isArray(parsedBlocks)) {
              editor.replaceBlocks(editor.document, parsedBlocks);
            } else {
              console.error("Imported JSON is not an array.");
              alert("Error: Imported JSON is not in the correct format.");
            }
          }
        } catch (error) {
          console.error("Error parsing JSON file:", error);
          alert("Error: Could not parse JSON file. Ensure it's valid.");
        }
      };

      reader.onerror = () => {
        console.error("Error reading file.");
        alert("Error: Could not read the selected file.");
      };

      reader.readAsText(file);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!editor) {
    return (
      <div className="app-container">
        <div>Loading Editor...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="controls-container">
        <button onClick={handleExportJson}>Export JSON</button>
        <button onClick={triggerFileInput}>Import JSON</button>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleImportJson}
          className="hidden-file-input" // Use class instead of inline style
        />
      </div>
      <div className="editor-area">
        <BlockNoteView editor={editor} />
      </div>
    </div>
  );
}

export default App;
