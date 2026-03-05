"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Link,
  Undo,
  Redo,
  Minus,
  Type,
  Palette,
  Square,
  Share2,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "p-1.5 rounded hover:bg-slate-100 transition-colors",
        active && "bg-slate-200 text-slate-900",
        disabled && "opacity-40 cursor-not-allowed"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-slate-200 mx-1" />;
}

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  title: string;
}

function ColorPicker({ color, onChange, title }: ColorPickerProps) {
  const colors = [
    "#000000", "#374151", "#6B7280", "#9CA3AF", "#FFFFFF",
    "#DC2626", "#EA580C", "#D97706", "#65A30D", "#16A34A",
    "#0891B2", "#2563EB", "#4F46E5", "#7C3AED", "#DB2777",
  ];
  
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={wrapperRef}>
      <ToolbarButton
        title={title}
        onClick={() => setIsOpen(!isOpen)}
        active={isOpen}
      >
        <Palette size={16} />
      </ToolbarButton>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div className="grid grid-cols-5 gap-1">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-6 h-6 rounded border border-slate-200",
                  color === c && "ring-2 ring-offset-1 ring-slate-400"
                )}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 w-full h-6 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}

interface FontSelectProps {
  value: string;
  onChange: (font: string) => void;
  options: { label: string; value: string }[];
  title: string;
}

function FontSelect({ value, onChange, options, title }: FontSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={wrapperRef}>
      <ToolbarButton
        title={title}
        onClick={() => setIsOpen(!isOpen)}
        active={isOpen}
      >
        <Type size={16} />
      </ToolbarButton>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 min-w-[120px]">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-2 py-1 text-left text-sm rounded hover:bg-slate-100",
                value === opt.value && "bg-slate-200 font-medium"
              )}
              style={{ fontFamily: opt.value }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface EditorToolbarProps {
  editor: Editor | null;
}

const fontFamilies = [
  { label: "Sans Serif", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Helvetica", value: "Helvetica, sans-serif" },
];

const fontSizes = [
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "32px", value: "32px" },
  { label: "36px", value: "36px" },
  { label: "48px", value: "48px" },
];

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const [textColor, setTextColor] = useState("#000000");
  const [linkColor, setLinkColor] = useState("#2563EB");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [fontSize, setFontSize] = useState("16px");

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addDivider = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  const setTextColorHandler = (color: string) => {
    setTextColor(color);
    editor.chain().focus().setColor(color).run();
  };

  const setLinkColorHandler = (color: string) => {
    setLinkColor(color);
    if (editor.isActive("link")) {
      editor.chain().focus().updateAttributes("link", { color }).run();
    }
  };

  const addButton = () => {
    const url = window.prompt("Enter button URL:") || "#";
    const text = window.prompt("Enter button text:") || "Click Here";
    const btnColor = window.prompt("Enter button color (hex):", "#2563EB") || "#2563EB";
    
    const html = `<a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: ${btnColor}; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: bold;">${text}</a><p></p>`;
    editor.chain().focus().insertContent(html).run();
  };

  const addSocialButton = (platform: string) => {
    const icons: Record<string, string> = {
      twitter: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg",
      facebook: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg",
      instagram: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg",
      linkedin: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg",
      youtube: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg",
      email: "mailto:",
    };
    
    const url = window.prompt(`Enter ${platform} URL:`) || "#";
    const html = `<a href="${url}" style="display: inline-block; margin: 0 4px;"><img src="${icons[platform]}" alt="${platform}" width="32" height="32" /></a>`;
    editor.chain().focus().insertContent(html).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-slate-200 bg-slate-50">
      <ToolbarButton
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo size={16} />
      </ToolbarButton>

      <Divider />

      {/* Font Family */}
      <FontSelect
        value={fontFamily}
        onChange={(font) => {
          setFontFamily(font);
          editor.chain().focus().setFontFamily(font).run();
        }}
        options={fontFamilies}
        title="Font Family"
      />

      {/* Font Size */}
      <FontSelect
        value={fontSize}
        onChange={(size) => {
          setFontSize(size);
          editor.chain().focus().setFontSize(size).run();
        }}
        options={fontSizes}
        title="Font Size"
      />

      <Divider />

      <ToolbarButton
        title="Heading 1"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive("heading", { level: 1 })}
      >
        <Heading1 size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 2"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
      >
        <Heading3 size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
      >
        <Underline size={16} />
      </ToolbarButton>

      <Divider />

      {/* Text Color */}
      <ColorPicker
        color={textColor}
        onChange={setTextColorHandler}
        title="Text Color"
      />

      {/* Link Color */}
      <ColorPicker
        color={linkColor}
        onChange={setLinkColorHandler}
        title="Link Color"
      />

      <Divider />

      <ToolbarButton
        title="Align Left"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
      >
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Align Center"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
      >
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Align Right"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
      >
        <AlignRight size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        title="Bullet List"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        title="Ordered List"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <Divider />

      <ToolbarButton title="Insert Link" onClick={addLink} active={editor.isActive("link")}>
        <Link size={16} />
      </ToolbarButton>
      <ToolbarButton title="Insert Image" onClick={addImage}>
        <Image size={16} />
      </ToolbarButton>
      <ToolbarButton title="Insert Divider" onClick={addDivider}>
        <Minus size={16} />
      </ToolbarButton>
      <ToolbarButton title="Insert Button" onClick={addButton}>
        <Square size={16} />
      </ToolbarButton>

      <Divider />

      {/* Social Buttons */}
      <div className="relative group">
        <ToolbarButton title="Social Icons" onClick={() => {}}>
          <Share2 size={16} />
        </ToolbarButton>
        <div className="absolute top-full left-0 mt-1 p-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 hidden group-hover:grid grid-cols-3 gap-1">
          <button type="button" onClick={() => addSocialButton("twitter")} title="X (Twitter)" className="p-1.5 hover:bg-slate-100 rounded">
            <Twitter size={16} />
          </button>
          <button type="button" onClick={() => addSocialButton("facebook")} title="Facebook" className="p-1.5 hover:bg-slate-100 rounded">
            <Facebook size={16} />
          </button>
          <button type="button" onClick={() => addSocialButton("instagram")} title="Instagram" className="p-1.5 hover:bg-slate-100 rounded">
            <Instagram size={16} />
          </button>
          <button type="button" onClick={() => addSocialButton("linkedin")} title="LinkedIn" className="p-1.5 hover:bg-slate-100 rounded">
            <Linkedin size={16} />
          </button>
          <button type="button" onClick={() => addSocialButton("youtube")} title="YouTube" className="p-1.5 hover:bg-slate-100 rounded">
            <Youtube size={16} />
          </button>
          <button type="button" onClick={() => addSocialButton("email")} title="Email" className="p-1.5 hover:bg-slate-100 rounded">
            <Mail size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
