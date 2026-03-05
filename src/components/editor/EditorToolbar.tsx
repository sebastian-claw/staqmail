"use client";

import { createPortal } from "react-dom";
import { type Editor } from "@tiptap/react";
import {
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered,
  Heading1, Heading2, Heading3,
  Image as ImageIcon, Link, Undo, Redo, Minus,
  Type, Palette, Square, Share2,
  Twitter, Facebook, Instagram, Linkedin, Youtube, Mail,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useState, useRef, useEffect, useCallback,
  type RefObject,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type OpenDropdown =
  | "textColor" | "linkColor"
  | "fontFamily" | "fontSize"
  | "social" | "image" | "link"
  | null;

// ─── Close on outside click ───────────────────────────────────────────────────
function useClickOutside(ref: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}

// ─── Portal dropdown: escapes overflow:hidden by rendering into document.body ─
function DropdownPortal({
  buttonRef, isOpen, width = 176, children,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>;
  isOpen: boolean;
  width?: number;
  children: React.ReactNode;
}) {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      let left = rect.left;
      if (left + width > window.innerWidth - 8) {
        left = rect.right - width;
      }
      setStyle({
        position: "fixed",
        top: rect.bottom + 6,
        left: Math.max(8, left),
        zIndex: 9999,
        width,
      });
    }
  }, [isOpen, buttonRef, width]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div style={style} className="bg-white border border-slate-200 rounded-lg shadow-xl">
      {children}
    </div>,
    document.body
  );
}

// ─── Toolbar Button ───────────────────────────────────────────────────────────
const ToolbarButton = ({
  onClick, active, disabled, title, children, btnRef,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
  btnRef?: RefObject<HTMLButtonElement | null>;
}) => (
  <button
    ref={btnRef}
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

const Divider = () => <div className="w-px h-5 bg-slate-200 mx-1" />;

// ─── Color Picker ─────────────────────────────────────────────────────────────
const COLORS = [
  "#000000", "#374151", "#6B7280", "#9CA3AF", "#FFFFFF",
  "#DC2626", "#EA580C", "#D97706", "#65A30D", "#16A34A",
  "#0891B2", "#2563EB", "#4F46E5", "#7C3AED", "#DB2777",
];

function ColorPicker({
  dropId, color, onChange, title, icon, openId, setOpenId,
}: {
  dropId: OpenDropdown;
  color: string;
  onChange: (c: string) => void;
  title: string;
  icon: React.ReactNode;
  openId: OpenDropdown;
  setOpenId: (id: OpenDropdown) => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = openId === dropId;

  useClickOutside(panelRef, useCallback(() => {
    if (isOpen) setOpenId(null);
  }, [isOpen, setOpenId]));

  return (
    <>
      <ToolbarButton
        btnRef={btnRef} title={title}
        onClick={() => setOpenId(isOpen ? null : dropId)}
        active={isOpen}
      >
        {icon}
      </ToolbarButton>

      <DropdownPortal buttonRef={btnRef} isOpen={isOpen} width={184}>
        <div ref={panelRef} className="p-3">
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
      </DropdownPortal>
    </>
  );
}

// ─── Select Dropdown (font / size) ───────────────────────────────────────────
function SelectDropdown({
  dropId, value, onChange, options, title, icon, openId, setOpenId,
}: {
  dropId: OpenDropdown;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  title: string;
  icon: React.ReactNode;
  openId: OpenDropdown;
  setOpenId: (id: OpenDropdown) => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = openId === dropId;

  useClickOutside(panelRef, useCallback(() => {
    if (isOpen) setOpenId(null);
  }, [isOpen, setOpenId]));

  return (
    <>
      <ToolbarButton
        btnRef={btnRef} title={title}
        onClick={() => setOpenId(isOpen ? null : dropId)}
        active={isOpen}
      >
        {icon}
      </ToolbarButton>

      <DropdownPortal buttonRef={btnRef} isOpen={isOpen} width={160}>
        <div ref={panelRef} className="py-1 max-h-60 overflow-y-auto">
          <p className="text-xs font-medium text-slate-400 px-3 pt-1 pb-1.5">{title}</p>
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
      </DropdownPortal>
    </>
  );
}

// ─── Social Icons Dropdown ────────────────────────────────────────────────────
const SOCIALS = [
  { key: "twitter",   label: "X / Twitter", icon: <Twitter size={15} /> },
  { key: "facebook",  label: "Facebook",    icon: <Facebook size={15} /> },
  { key: "instagram", label: "Instagram",   icon: <Instagram size={15} /> },
  { key: "linkedin",  label: "LinkedIn",    icon: <Linkedin size={15} /> },
  { key: "youtube",   label: "YouTube",     icon: <Youtube size={15} /> },
  { key: "email",     label: "Email",       icon: <Mail size={15} /> },
];

function SocialDropdown({
  openId, setOpenId, onInsert,
}: {
  openId: OpenDropdown;
  setOpenId: (id: OpenDropdown) => void;
  onInsert: (platform: string) => void;
}) {
  const btnRef  = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen  = openId === "social";

  useClickOutside(panelRef, useCallback(() => {
    if (isOpen) setOpenId(null);
  }, [isOpen, setOpenId]));

  return (
    <>
      <ToolbarButton
        btnRef={btnRef} title="Social Icons"
        onClick={() => setOpenId(isOpen ? null : "social")}
        active={isOpen}
      >
        <Share2 size={16} />
      </ToolbarButton>

      <DropdownPortal buttonRef={btnRef} isOpen={isOpen} width={176}>
        <div ref={panelRef} className="py-1">
          <p className="text-xs font-medium text-slate-400 px-3 pt-1 pb-1.5">Insert social icon</p>
          {SOCIALS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => { onInsert(key); setOpenId(null); }}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-left hover:bg-slate-100 transition-colors"
            >
              <span className="text-slate-500">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </DropdownPortal>
    </>
  );
}

// ─── Image Insert Dropdown (replaces window.prompt) ──────────────────────────
function ImageDropdown({
  openId, setOpenId, onInsert,
}: {
  openId: OpenDropdown;
  setOpenId: (id: OpenDropdown) => void;
  onInsert: (url: string, alt: string) => void;
}) {
  const btnRef   = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen   = openId === "image";
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  useClickOutside(panelRef, useCallback(() => {
    if (isOpen) setOpenId(null);
  }, [isOpen, setOpenId]));

  const handleInsert = () => {
    if (!url.trim()) return;
    onInsert(url.trim(), alt.trim());
    setUrl("");
    setAlt("");
    setOpenId(null);
  };

  return (
    <>
      <ToolbarButton
        btnRef={btnRef} title="Insert Image"
        onClick={() => setOpenId(isOpen ? null : "image")}
        active={isOpen}
      >
        <ImageIcon size={16} />
      </ToolbarButton>

      <DropdownPortal buttonRef={btnRef} isOpen={isOpen} width={272}>
        <div ref={panelRef} className="p-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-700">Insert Image</p>
            <button
              type="button" onClick={() => setOpenId(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          </div>
          <label className="block text-xs text-slate-500 mb-1">Image URL</label>
          <input
            autoFocus
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInsert()}
            placeholder="https://example.com/image.png"
            className="w-full text-sm px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          />
          <label className="block text-xs text-slate-500 mb-1">Alt text (optional)</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInsert()}
            placeholder="Image description"
            className="w-full text-sm px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <button
            type="button"
            onClick={handleInsert}
            disabled={!url.trim()}
            className="w-full py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Insert
          </button>
        </div>
      </DropdownPortal>
    </>
  );
}

// ─── Link Insert Dropdown (replaces window.prompt) ───────────────────────────
function LinkDropdown({
  openId, setOpenId, onInsert, isActive,
}: {
  openId: OpenDropdown;
  setOpenId: (id: OpenDropdown) => void;
  onInsert: (url: string) => void;
  isActive: boolean;
}) {
  const btnRef   = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen   = openId === "link";
  const [url, setUrl] = useState("");

  useClickOutside(panelRef, useCallback(() => {
    if (isOpen) setOpenId(null);
  }, [isOpen, setOpenId]));

  const handleInsert = () => {
    if (!url.trim()) return;
    onInsert(url.trim());
    setUrl("");
    setOpenId(null);
  };

  return (
    <>
      <ToolbarButton
        btnRef={btnRef} title="Insert Link"
        onClick={() => setOpenId(isOpen ? null : "link")}
        active={isActive || isOpen}
      >
        <Link size={16} />
      </ToolbarButton>

      <DropdownPortal buttonRef={btnRef} isOpen={isOpen} width={256}>
        <div ref={panelRef} className="p-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-700">Insert Link</p>
            <button type="button" onClick={() => setOpenId(null)} className="text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          </div>
          <label className="block text-xs text-slate-500 mb-1">URL</label>
          <input
            autoFocus
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleInsert()}
            placeholder="https://example.com"
            className="w-full text-sm px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
          <button
            type="button"
            onClick={handleInsert}
            disabled={!url.trim()}
            className="w-full py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Insert Link
          </button>
        </div>
      </DropdownPortal>
    </>
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
  const [textColor,  setTextColor]  = useState("#000000");
  const [linkColor,  setLinkColor]  = useState("#2563EB");
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [fontSize,   setFontSize]   = useState("16px");
  const [openId,     setOpenId]     = useState<OpenDropdown>(null);

  if (!editor) return null;

  const addSocialIcon = (platform: string) => {
    const cdnBase = "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons";
    const iconMap: Record<string, string> = {
      twitter: `${cdnBase}/x.svg`,
      facebook: `${cdnBase}/facebook.svg`,
      instagram: `${cdnBase}/instagram.svg`,
      linkedin: `${cdnBase}/linkedin.svg`,
      youtube: `${cdnBase}/youtube.svg`,
      email: `${cdnBase}/gmail.svg`,
    };
    // Ask for URL via a quick follow-up prompt inserted into the editor
    const url = prompt(`Enter ${platform} URL:`) ?? "#";
    const html = `<a href="${url}" style="display:inline-block;margin:0 4px;"><img src="${iconMap[platform]}" alt="${platform}" width="32" height="32" /></a>`;
    editor.chain().focus().insertContent(html).run();
  };

  const addButton = () => {
    const text     = prompt("Button text:", "Click Here") ?? "Click Here";
    const url      = prompt("Button URL:", "#") ?? "#";
    const btnColor = prompt("Button color (hex):", "#2563EB") ?? "#2563EB";
    const html = `<a href="${url}" style="display:inline-block;padding:12px 24px;background-color:${btnColor};color:#ffffff;text-decoration:none;border-radius:4px;font-weight:bold;">${text}</a><p></p>`;
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
        dropId="fontFamily" openId={openId} setOpenId={setOpenId}
        value={fontFamily} title="Font Family" icon={<Type size={16} />}
        options={fontFamilies}
        onChange={(v) => { setFontFamily(v); editor.chain().focus().setFontFamily(v).run(); }}
      />

      {/* Font size */}
      <SelectDropdown
        dropId="fontSize" openId={openId} setOpenId={setOpenId}
        value={fontSize} title="Font Size"
        icon={<span className="text-xs font-bold">Aa</span>}
        options={fontSizes}
        onChange={(v) => { setFontSize(v); editor.chain().focus().setFontSize(v).run(); }}
      />

      <Divider />

      {/* Headings */}
      <ToolbarButton title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}><Heading1 size={16} /></ToolbarButton>
      <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}><Heading2 size={16} /></ToolbarButton>
      <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}><Heading3 size={16} /></ToolbarButton>

      <Divider />

      {/* Formatting */}
      <ToolbarButton title="Bold"      onClick={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive("bold")}>     <Bold size={16} />      </ToolbarButton>
      <ToolbarButton title="Italic"    onClick={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive("italic")}>   <Italic size={16} />    </ToolbarButton>
      <ToolbarButton title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}><Underline size={16} /> </ToolbarButton>

      <Divider />

      {/* Colors */}
      <ColorPicker
        dropId="textColor" openId={openId} setOpenId={setOpenId}
        color={textColor} title="Text Color" icon={<Palette size={16} />}
        onChange={(c) => { setTextColor(c); editor.chain().focus().setColor(c).run(); }}
      />
      <ColorPicker
        dropId="linkColor" openId={openId} setOpenId={setOpenId}
        color={linkColor} title="Link Color"
        icon={<span className="text-xs font-bold underline text-blue-600">A</span>}
        onChange={(c) => {
          setLinkColor(c);
          if (editor.isActive("link")) editor.chain().focus().updateAttributes("link", { color: c }).run();
        }}
      />

      <Divider />

      {/* Alignment */}
      <ToolbarButton title="Align Left"   onClick={() => editor.chain().focus().setTextAlign("left").run()}   active={editor.isActive({ textAlign: "left" })}>  <AlignLeft size={16} />   </ToolbarButton>
      <ToolbarButton title="Align Center" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}><AlignCenter size={16} /> </ToolbarButton>
      <ToolbarButton title="Align Right"  onClick={() => editor.chain().focus().setTextAlign("right").run()}  active={editor.isActive({ textAlign: "right" })}>  <AlignRight size={16} />  </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton title="Bullet List"  onClick={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive("bulletList")}>  <List size={16} />        </ToolbarButton>
      <ToolbarButton title="Ordered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}><ListOrdered size={16} /> </ToolbarButton>

      <Divider />

      {/* Insert: link, image, divider, button */}
      <LinkDropdown
        openId={openId} setOpenId={setOpenId}
        isActive={editor.isActive("link")}
        onInsert={(url) => editor.chain().focus().setLink({ href: url }).run()}
      />
      <ImageDropdown
        openId={openId} setOpenId={setOpenId}
        onInsert={(url, alt) => editor.chain().focus().setImage({ src: url, alt }).run()}
      />
      <ToolbarButton title="Insert Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus size={16} />
      </ToolbarButton>
      <ToolbarButton title="Insert Button" onClick={addButton}>
        <Square size={16} />
      </ToolbarButton>

      <Divider />

      {/* Social Icons */}
      <SocialDropdown openId={openId} setOpenId={setOpenId} onInsert={addSocialIcon} />
    </div>
  );
}
