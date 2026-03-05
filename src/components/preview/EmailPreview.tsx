"use client";

import { useAppStore } from "@/lib/store/app-store";
import { wrapEmailHtml } from "@/lib/utils/html-export";

export default function EmailPreview() {
  const { currentHtml, currentSubject } = useAppStore();

  const fullHtml = wrapEmailHtml(currentHtml, { subject: currentSubject });

  if (!currentHtml || currentHtml === "<p></p>") {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 text-sm">
        Start typing to see a preview
      </div>
    );
  }

  return (
    <iframe
      title="Email Preview"
      srcDoc={fullHtml}
      className="w-full h-full border-0 rounded-lg bg-white"
      sandbox="allow-same-origin"
    />
  );
}
