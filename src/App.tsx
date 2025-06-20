import React, { useRef } from "react";
import "@blocknote/core/style.css";
import "@blocknote/react/style.css";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "./App.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { type Block } from "@blocknote/core";
import { codeBlock } from "@blocknote/code-block";

function App() {
  const editor = useCreateBlockNote({
    codeBlock,
    initialContent: [
      {
        type: "paragraph",
        content: "Welcome to this demo!",
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Blocks:",
            styles: { bold: true },
          },
        ],
      },
      {
        type: "paragraph",
        content: "Paragraph",
      },
      {
        type: "heading",
        content: "Heading",
      },
      {
        type: "quote",
        content: "Quote",
      },
      {
        type: "bulletListItem",
        content: "Bullet List Item",
      },
      {
        type: "numberedListItem",
        content: "Numbered List Item",
      },
      {
        type: "checkListItem",
        content: "Check List Item",
      },
      {
        type: "codeBlock",
        props: { language: "javascript" },
        content: "console.log('Hello, world!');",
      },
      {
        type: "table",
        content: {
          type: "tableContent",
          rows: [
            {
              cells: ["Table Cell", "Table Cell", "Table Cell"],
            },
            {
              cells: ["Table Cell", "Table Cell", "Table Cell"],
            },
            {
              cells: ["Table Cell", "Table Cell", "Table Cell"],
            },
          ],
        },
      },
      {
        type: "file",
      },
      {
        type: "image",
        props: {
          url: "https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg",
          caption:
            "From https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg",
        },
      },
      {
        type: "video",
        props: {
          url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
          caption:
            "From https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm",
        },
      },
      {
        type: "audio",
        props: {
          url: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
          caption:
            "From https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
        },
      },
      {
        type: "paragraph",
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Inline Content:",
            styles: { bold: true },
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Styled Text",
            styles: {
              bold: true,
              italic: true,
              textColor: "red",
              backgroundColor: "blue",
            },
          },
          {
            type: "text",
            text: " ",
            styles: {},
          },
          {
            type: "link",
            content: "Link",
            href: "https://www.blocknotejs.org",
          },
        ],
      },
      {
        type: "paragraph",
      },
    ],
  });

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
          className="hidden-file-input"
        />
      </div>
      <div className="editor-area">
        <BlockNoteView editor={editor} />
      </div>
    </div>
  );
}

export default App;
