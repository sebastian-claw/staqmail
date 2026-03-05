"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered,
  Heading1, Heading2, Heading3,
  Image, Link, Undo, Redo, Minus,
  Type, Palette, Square, Share2,
  Twitter, Facebook, Instagram, Linkedin, Youtube, Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback } from "react";

// ─── Shared close-on-outside-click hook ──────────────────────────────────────
function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}

// ─── Context: only one dropdown open at a time ────────────────────────────────
type OpenDropdown = "textColor" | "linkColor" | "fontFamily" | "fontSize" | "social" | null;

// ─── Toolbar Button ───────────────────────────────────────────────────────────
function ToolbarButton({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
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

// ─── Color Picker Dropdown ────────────────────────────────────────────────────
const COLORS = [
  "#000000", "#374151", "#6B7280", "#9CA3AF", "#FFFFFF",
  "#DC2626", "#EA580C", "#D97706", "#65A30D", "#16A34A",
  "#0891B2", "#2563EB", "#4F46E5", "#7C3AED", "#DB2777",
];

function ColorPicker({
  id, color, onChange, title, icon,
  openId, setOpenId,
}: {
  id: OpenDropdown;
  color: string;
  onChange: (c: string) => void;
  title: string;
  icon: React.ReactNode;
  openId: OpenDropdown;
  setOpenId: (id: OpenDropdown) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openId === id;

  useClickOutside(ref, useCallback(() => {
    if (isOpen) setOpenId(null);
  }, [isOpen, setOpenId]));

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton title={title} onClick={() => setOpenId(isOpen ? null : id)} active={isOpen}>
        {icon}
      </ToolbarButton>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-3 w-44">
          <p className="text-xs font-medium text-slate-500 mb-2">{title}</p>
          <div className="grid grid-cols-5 gap-1.5 mb-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { onChange(c); setOpenId(null); }}
                className={cn(
                  "w-6 h-6 rounded border border-slate-300 hover:scale-110 transition-transform",
                  color === c && "ring-2 ring-offset-1 ring-blue-500"
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
            className="w-full h-7 cursor-pointer rounded border border-slate-200"
          />
        </div>
      )}
    </div>
  );
}

// ─── Font / Size Dropdown ─────────────────────────────────────────────────────
function SelectDropdown({
  id, value, onChange, options, title, icon,
  openId, setOpenId,
}: {
  id: OpenDropdown;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  title: string;
  icon: React.ReactNode;
  openId: OpenDropdown;
  setOpenId: (id: OpenDropdown) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openId === id;

  useClickOutside(ref, useCallback(() => {
    if (isOpen) setOpenId(null);
  }, [isOpen, setOpenId]));

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton title={title} onClick={() => setOpenId(isOpen ? null : id)} active={isOpen}>
        {icon}
      </ToolbarButton>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 min-w-[140px] max-h-60 overflow-y-auto">
          <p className="text-xs font-medium text-slate-400 px-2 pt-1 pb-1.5">{title}</p>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpenId(null); }}
              className={cn(
                "w-full px-3 py-1.5 text-left text-sm hover:bg-slate-100 transition-colors",
                value === opt.value && "bg-slate-100 font-semibold"
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

// ─── Social Icons Dropdown ────────────────────────────────────────────────────
const SOCIALS = [
  { key: "twitter",   label: "X / Twitter", icon: <Twitter size={16} />,   placeholder: "https://twitter.com/you" },
  { key: "facebook",  label: "Facebook",    icon: <Facebook size={16} />,  placeholder: "https://facebook.com/you" },
  { key: "instagram", label: "Instagram",   icon: <Instagram size={16} />, placeholder: "https://instagram.com/you" },
  { key: "linkedin",  label: "LinkedIn",    icon: <Linkedin size={16} />,  placeholder: "https://linkedin.com/in/you" },
  { key: "youtube",   label: "YouTube",     icon: <Youtube size={16} />,  placeholder: "https://youtube.com/you" },
  { key: "email",     label: "Email",       icon: <Mail size={16} />,      placeholder: "mailto:you@example.com" },
];

function SocialDropdown({
  openId, setOpenId, onInsert,
}: {
  openId: OpenDropdown;
  setOpenId: (id: OpenDropdown) => void;
  onInsert: (platform: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = openId === "social";

  useClickOutside(ref, useCallback(() => {
    if (isOpen) setOpenId(null);
  }, [isOpen, setOpenId]));

  return (
    <div className="relative" ref={ref}>
      <ToolbarButton title="Social Icons" onClick={() => setOpenId(isOpen ? null : "social")} active={isOpen}>
        <Share2 size={16} />
      </ToolbarButton>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 w-44">
          <p className="text-xs font-medium text-slate-400 px-3 pt-1 pb-1.5">Insert social icon</p>
          {SOCIALS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => { onInsert(key); setOpenId(null); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-slate-100 transition-colors"
            >
              <span className="text-slate-600">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Toolbar ─────────────────────────────────────────────────────────────
const fontFamilies = [
  { label: "Sans Serif",      value: "sans-serif" },
  { label: "Serif",           value: "serif" },
  { label: "Arial",           value: "Arial, sans-serif" },
  { label: "Georgia",         value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Verdana",         value: "Verdana, sans-serif" },
  { label: "Helvetica",       value: "Helvetica, sans-serif" },
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

export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  const [textColor, setTextColor]   = useState("#000000");
  const [linkColor, setLinkColor]   = useState("#2563EB");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [fontSize, setFontSize]     = useState("16px");
  const [openId, setOpenId]         = useState<OpenDropdown>(null);

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addButton = () => {
    const text     = window.prompt("Button text:", "Click Here") || "Click Here";
    const url      = window.prompt("Button URL:", "#") || "#";
    const btnColor = window.prompt("Button color (hex):", "#2563EB") || "#2563EB";
    const html = `<a href="${url}" style="display:inline-block;padding:12px 24px;background-color:${btnColor};color:#ffffff;text-decoration:none;border-radius:4px;font-weight:bold;">${text}</a><p></p>`;
    editor.chain().focus().insertContent(html).run();
  };

  const addSocialButton = (platform: string) => {
    const url = window.prompt(`Enter ${platform} URL:`) || "#";
    const cdnBase = "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons";
    const iconMap: Record<string, string> = {
      twitter: `${cdnBase}/x.svg`,
      facebook: `${cdnBase}/facebook.svg`,
      instagram: `${cdnBase}/instagram.svg`,
      linkedin: `${cdnBase}/linkedin.svg`,
      youtube: `${cdnBase}/youtube.svg`,
      email: `${cdnBase}/gmail.svg`,
    };
    const src = iconMap[platform] ?? "";
    const html = `<a href="${url}" style="display:inline-block;margin:0 4px;"><img src="${src}" alt="${platform}" width="32" height="32" /></a>`;
    editor.chain().focus().insertContent(html).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-slate-200 bg-slate-50">
      {/* Undo / Redo */}
      <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo size={16} />
      </ToolbarButton>
      <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo size={16} />
      </ToolbarButton>

      <Divider />

      {/* Font family */}
      <SelectDropdown
        id="fontFamily" openId={openId} setOpenId={setOpenId}
        value={fontFamily} title="Font Family" icon={<Type size={16} />}
        options={fontFamilies}
        onChange={(v) => { setFontFamily(v); editor.chain().focus().setFontFamily(v).run(); }}
      />

      {/* Font size */}
      <SelectDropdown
        id="fontSize" openId={openId} setOpenId={setOpenId}
        value={fontSize} title="Font Size" icon={<span className="text-xs font-bold">Aa</span>}
        options={fontSizes}
        onChange={(v) => { setFontSize(v); editor.chain().focus().setFontSize(v).run(); }}
      />

      <Divider />

      {/* Headings */}
      <ToolbarButton title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>
        <Heading1 size={16} />
      </ToolbarButton>
      <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
        <Heading3 size={16} />
      </ToolbarButton>

      <Divider />

      {/* Text formatting */}
      <ToolbarButton title="Bold"      onClick={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive("bold")}>      <Bold size={16} />      </ToolbarButton>
      <ToolbarButton title="Italic"    onClick={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive("italic")}>    <Italic size={16} />    </ToolbarButton>
      <ToolbarButton title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}> <Underline size={16} /> </ToolbarButton>

      <Divider />

      {/* Colors */}
      <ColorPicker
        id="textColor" openId={openId} setOpenId={setOpenId}
        color={textColor} title="Text Color" icon={<Palette size={16} />}
        onChange={(c) => { setTextColor(c); editor.chain().focus().setColor(c).run(); }}
      />
      <ColorPicker
        id="linkColor" openId={openId} setOpenId={setOpenId}
        color={linkColor} title="Link Color"
        icon={<span className="text-xs font-bold underline text-blue-600">A</span>}
        onChange={(c) => {
          setLinkColor(c);
          if (editor.isActive("link")) editor.chain().focus().updateAttributes("link", { color: c }).run();
        }}
      />

      <Divider />

      {/* Alignment */}
      <ToolbarButton title="Align Left"   onClick={() => editor.chain().focus().setTextAlign("left").run()}   active={editor.isActive({ textAlign: "left" })}>   <AlignLeft size={16} />   </ToolbarButton>
      <ToolbarButton title="Align Center" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}> <AlignCenter size={16} /> </ToolbarButton>
      <ToolbarButton title="Align Right"  onClick={() => editor.chain().focus().setTextAlign("right").run()}  active={editor.isActive({ textAlign: "right" })}>  <AlignRight size={16} />  </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton title="Bullet List"  onClick={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive("bulletList")}>  <List size={16} />         </ToolbarButton>
      <ToolbarButton title="Ordered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}> <ListOrdered size={16} /> </ToolbarButton>

      <Divider />

      {/* Insert */}
      <ToolbarButton title="Insert Link"    onClick={addLink}                                         active={editor.isActive("link")}> <Link size={16} />   </ToolbarButton>
      <ToolbarButton title="Insert Image"   onClick={addImage}>                                                                         <Image size={16} />  </ToolbarButton>
      <ToolbarButton title="Insert Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>                           <Minus size={16} />  </ToolbarButton>
      <ToolbarButton title="Insert Button"  onClick={addButton}>                                                                        <Square size={16} /> </ToolbarButton>

      <Divider />

      {/* Social Icons */}
      <SocialDropdown openId={openId} setOpenId={setOpenId} onInsert={addSocialButton} />
    </div>
  );
}
