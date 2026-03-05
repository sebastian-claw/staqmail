"use client";

import { useAppStore } from "@/lib/store/app-store";
import { FileText, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TemplatePanel() {
  const {
    templates,
    activeTemplateId,
    currentSubject,
    currentHtml,
    loadTemplate,
    saveTemplate,
    deleteTemplate,
    newDraft,
  } = useAppStore();

  const handleSave = () => {
    const name = window.prompt("Template name:", currentSubject || "Untitled");
    if (!name) return;
    saveTemplate({ name, subject: currentSubject, htmlContent: currentHtml });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-700">Templates</h2>
        <div className="flex gap-2">
          <button
            onClick={newDraft}
            title="New draft"
            className="p-1 rounded hover:bg-slate-100"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {templates.length === 0 ? (
          <div className="text-slate-400 text-xs text-center py-8 px-4">
            No templates yet. Save your current email to create one.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {templates.map((tpl) => (
              <li
                key={tpl.id}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-slate-50 group",
                  activeTemplateId === tpl.id && "bg-blue-50"
                )}
                onClick={() => loadTemplate(tpl.id)}
              >
                <FileText
                  size={14}
                  className={cn(
                    "shrink-0 text-slate-400",
                    activeTemplateId === tpl.id && "text-blue-500"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm truncate",
                      activeTemplateId === tpl.id
                        ? "text-blue-700 font-medium"
                        : "text-slate-700"
                    )}
                  >
                    {tpl.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{tpl.subject}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTemplate(tpl.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-500 transition-opacity"
                  title="Delete template"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleSave}
          className="w-full text-sm bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-700 transition-colors"
        >
          Save as Template
        </button>
      </div>
    </div>
  );
}
