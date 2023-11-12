"use client";
import { Block, BlockNoteEditor, PartialBlock } from "@blocknote/core";
import {
  BlockNoteView,
  ReactSlashMenuItem,
  getDefaultReactSlashMenuItems,
  useBlockNote,
} from "@blocknote/react";
import { useCompletion } from "ai/react";
import { PenLine } from "lucide-react";
import { useTheme } from "next-themes";
import "@blocknote/core/style.css";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
      file,
    });

    return response.url;
  };

  //** Ai Block **//

  // Continue Writing
  const { completion, complete } = useCompletion({ api: "/api/completions" });

  // Command to insert completions.
  const aiAutoCompletion = (editor: BlockNoteEditor) => {
    // Block that the text cursor is currently in.
    const currentBlock: Block = editor.getTextCursorPosition().block;
    const prompt = currentBlock.content?.toString;
    if (prompt) {
      complete(prompt());
    }

    // New block we want to insert.
    const aiAutoCompletionBlock: PartialBlock = {
      type: "paragraph",
      content: [{ type: "text", text: completion, styles: {} }],
    };

    // Inserting the new block after the current one.
    editor.insertBlocks([aiAutoCompletionBlock], currentBlock, "nested");
  };

  // Custom Slash Menu item which executes the above function.
  const aiContinueWriting: ReactSlashMenuItem = {
    name: "Continue Writing",
    execute: aiAutoCompletion,
    group: "Student Hub Ai",
    icon: <PenLine />,
    hint: "Used to insert a block with 'Hello World' below.",
  };

  // Summarize
  // Ask AI

  //* Embed Block *//
  // Pdf Embed
  // Youtube Embed
  // Web Embed
  // Image Embed

  const customSlashMenuItemList = [
    ...getDefaultReactSlashMenuItems(),
    aiContinueWriting,
  ];

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload,
    slashMenuItems: customSlashMenuItemList,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
