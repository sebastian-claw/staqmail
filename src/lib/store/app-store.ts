/**
 * Global app state via Zustand
 */
import { create } from "zustand";

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  createdAt: number;
  updatedAt: number;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  orgSlug: string | null;

  // Current compose session
  currentSubject: string;
  currentHtml: string;
  isDirty: boolean;

  // Templates
  templates: EmailTemplate[];
  activeTemplateId: string | null;

  // Actions
  setAuth: (authenticated: boolean, orgSlug?: string) => void;
  setCurrentSubject: (subject: string) => void;
  setCurrentHtml: (html: string) => void;
  saveTemplate: (template: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt">) => void;
  loadTemplate: (id: string) => void;
  deleteTemplate: (id: string) => void;
  newDraft: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  orgSlug: null,
  currentSubject: "",
  currentHtml: "",
  isDirty: false,
  templates: [],
  activeTemplateId: null,

  setAuth: (authenticated, orgSlug) =>
    set({ isAuthenticated: authenticated, orgSlug: orgSlug ?? null }),

  setCurrentSubject: (subject) => set({ currentSubject: subject, isDirty: true }),

  setCurrentHtml: (html) => set({ currentHtml: html, isDirty: true }),

  saveTemplate: (templateData) => {
    const existing = get().templates.find((t) => t.name === templateData.name);
    const now = Date.now();

    if (existing) {
      set({
        templates: get().templates.map((t) =>
          t.id === existing.id ? { ...t, ...templateData, updatedAt: now } : t
        ),
        activeTemplateId: existing.id,
        isDirty: false,
      });
    } else {
      const newTemplate: EmailTemplate = {
        ...templateData,
        id: `tpl_${now}`,
        createdAt: now,
        updatedAt: now,
      };
      set({
        templates: [...get().templates, newTemplate],
        activeTemplateId: newTemplate.id,
        isDirty: false,
      });
    }
  },

  loadTemplate: (id) => {
    const template = get().templates.find((t) => t.id === id);
    if (template) {
      set({
        currentSubject: template.subject,
        currentHtml: template.htmlContent,
        activeTemplateId: id,
        isDirty: false,
      });
    }
  },

  deleteTemplate: (id) =>
    set({
      templates: get().templates.filter((t) => t.id !== id),
      activeTemplateId: get().activeTemplateId === id ? null : get().activeTemplateId,
    }),

  newDraft: () =>
    set({
      currentSubject: "",
      currentHtml: "",
      activeTemplateId: null,
      isDirty: false,
    }),
}));
