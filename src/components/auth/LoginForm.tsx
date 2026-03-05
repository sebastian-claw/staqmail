"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store/app-store";
import { initClient } from "@/lib/api/churchstaq";

export default function LoginForm() {
  const { setAuth } = useAppStore();
  const [apiKey, setApiKey] = useState("");
  const [orgSlug, setOrgSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const client = initClient({ apiKey, organizationSlug: orgSlug });
    const valid = await client.verifyCredentials();

    if (valid) {
      setAuth(true, orgSlug);
    } else {
      setError("Invalid credentials. Check your API key and organization slug.");
    }

    setLoading(false);
  };

  const handleSkip = () => {
    console.log("Skip button clicked");
    setAuth(false, "");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">StaqMail</h1>
          <p className="text-slate-500 text-sm mt-1">
            Connect your ChurchStaq account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Organization Slug
            </label>
            <input
              type="text"
              value={orgSlug}
              onChange={(e) => setOrgSlug(e.target.value)}
              placeholder="your-church"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="••••••••••••••••"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Connecting..." : "Connect to ChurchStaq"}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full bg-slate-100 text-slate-600 py-2 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors"
          >
            Skip — Test Email Composer
          </button>
        </form>
      </div>
    </div>
  );
}
