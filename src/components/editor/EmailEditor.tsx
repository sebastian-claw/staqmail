"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store/app-store";
import EditorToolbar from "./EditorToolbar";

export default function EmailEditor() {
  const { currentHtml, setCurrentHtml } = useAppStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start composing your email..." }),
    ],
    content: currentHtml || "<p></p>",
    onUpdate: ({ editor }) => {
      setCurrentHtml(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
  });

  // Sync external content changes (e.g. loading a template)
  useEffect(() => {
    if (editor && currentHtml !== editor.getHTML()) {
      editor.commands.setContent(currentHtml || "<p></p>", { emitUpdate: false });
    }
  }, [currentHtml, editor]);

  return (
    <div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden bg-white">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
