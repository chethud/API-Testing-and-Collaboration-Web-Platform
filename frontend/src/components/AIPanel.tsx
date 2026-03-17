import { useState } from "react";
import api from "../api/client";
import type { RequestConfig } from "./RequestBuilder";

type Props = {
  onApply: (config: Partial<RequestConfig>) => void;
};

export default function AIPanel({ onApply }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<RequestConfig | null>(null);

  async function suggest() {
    if (!prompt.trim()) return;
    setLoading(true);
    setSuggestion(null);
    try {
      const { data } = await api.post<{ method: string; url: string; headers: Record<string, string>; body?: string }>(
        "/ai/suggest",
        { prompt }
      );
      setSuggestion({
        method: data.method,
        url: data.url,
        headers: data.headers || {},
        queryParams: {},
        body: data.body || "",
        bodyType: "json",
      });
    } catch {
      setSuggestion(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t border-slate-700 p-2">
      <div className="text-xs font-medium text-slate-500 uppercase mb-2">AI Assistant</div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the API request (e.g. GET user by id from https://api.example.com/users)"
        className="w-full rounded bg-slate-700 border border-slate-600 text-white text-sm px-2 py-1.5 min-h-[60px]"
      />
      <button
        onClick={suggest}
        disabled={loading}
        className="mt-2 rounded bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-3 py-1 text-sm"
      >
        {loading ? "..." : "Suggest"}
      </button>
      {suggestion && (
        <div className="mt-2 p-2 rounded bg-slate-700 text-sm">
          <div className="text-slate-400 mb-1">Suggested:</div>
          <div className="font-mono text-xs text-slate-300 truncate">{suggestion.method} {suggestion.url}</div>
          <button
            onClick={() => {
              onApply(suggestion);
              setSuggestion(null);
              setPrompt("");
            }}
            className="mt-1 text-violet-400 text-xs"
          >
            Use this
          </button>
        </div>
      )}
    </div>
  );
}
