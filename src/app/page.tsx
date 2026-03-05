"use client";

import { useAppStore } from "@/lib/store/app-store";
import LoginForm from "@/components/auth/LoginForm";
import EmailEditor from "@/components/editor/EmailEditor";
import EmailPreview from "@/components/preview/EmailPreview";
import TemplatePanel from "@/components/templates/TemplatePanel";
import { wrapEmailHtml } from "@/lib/utils/html-export";
import { Download, Send, Mail } from "lucide-react";

export default function Home() {
  const { isAuthenticated, currentSubject, setCurrentSubject, currentHtml, orgSlug } =
    useAppStore();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const handleExportHtml = () => {
    const html = wrapEmailHtml(currentHtml, { subject: currentSubject });
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentSubject || "email"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center gap-4 px-4 py-2 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-base">
          <Mail size={18} className="text-blue-600" />
          StaqMail
        </div>
        <span className="text-xs text-slate-400">{orgSlug}</span>

        <div className="flex-1" />

        <input
          type="text"
          value={currentSubject}
          onChange={(e) => setCurrentSubject(e.target.value)}
          placeholder="Email subject..."
          className="flex-1 max-w-sm px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <button
            onClick={handleExportHtml}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={14} />
            Export HTML
          </button>
          <button className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Send size={14} />
            Send
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Template sidebar */}
        <aside className="w-56 shrink-0 bg-white border-r border-slate-200 overflow-hidden flex flex-col">
          <TemplatePanel />
        </aside>

        {/* Editor + Preview split */}
        <div className="flex flex-1 gap-3 p-3 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <p className="text-xs text-slate-500 mb-1.5 font-medium">EDITOR</p>
            <div className="flex-1 overflow-hidden">
              <EmailEditor />
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <p className="text-xs text-slate-500 mb-1.5 font-medium">PREVIEW</p>
            <div className="flex-1 overflow-hidden rounded-lg border border-slate-200">
              <EmailPreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
