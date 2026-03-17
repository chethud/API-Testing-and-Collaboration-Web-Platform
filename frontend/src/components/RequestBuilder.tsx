import { useState } from "react";

export type RequestConfig = {
  method: string;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: string;
  bodyType: string;
};

type Props = {
  config: RequestConfig;
  onChange: (c: RequestConfig) => void;
  onSend: () => void;
  loading?: boolean;
};

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export default function RequestBuilder({ config, onChange, onSend, loading }: Props) {
  const [headersOpen, setHeadersOpen] = useState(false);
  const [paramsOpen, setParamsOpen] = useState(false);
  const [bodyOpen, setBodyOpen] = useState(true);

  function update(partial: Partial<RequestConfig>) {
    onChange({ ...config, ...partial });
  }

  function addHeader() {
    const k = Object.keys(config.headers).length ? "" : "Content-Type";
    const v = Object.keys(config.headers).length ? "" : "application/json";
    update({ headers: { ...config.headers, [k]: v } });
  }

  function removeHeader(key: string) {
    const next = { ...config.headers };
    delete next[key];
    update({ headers: next });
  }

  function addParam() {
    update({ queryParams: { ...config.queryParams, "": "" } });
  }

  function removeParam(key: string) {
    const next = { ...config.queryParams };
    delete next[key];
    update({ queryParams: next });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b border-slate-700 bg-slate-800">
        <select
          value={config.method}
          onChange={(e) => update({ method: e.target.value })}
          className="rounded bg-slate-700 border border-slate-600 text-white px-2 py-1.5 text-sm font-mono w-24"
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={config.url}
          onChange={(e) => update({ url: e.target.value })}
          placeholder="https://api.example.com/..."
          className="flex-1 rounded bg-slate-700 border border-slate-600 text-white px-3 py-1.5 text-sm font-mono"
        />
        <button
          onClick={onSend}
          disabled={loading}
          className="rounded bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-4 py-1.5 text-sm font-medium"
        >
          {loading ? "Send..." : "Send"}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-2">
        <div>
          <button
            onClick={() => setParamsOpen(!paramsOpen)}
            className="text-sm text-slate-400 hover:text-white w-full text-left flex items-center gap-1"
          >
            {paramsOpen ? "▼" : "▶"} Query params
          </button>
          {paramsOpen && (
            <div className="mt-1 space-y-1 pl-4">
              {Object.entries(config.queryParams).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <input
                    value={k}
                    onChange={(e) => {
                      const next = { ...config.queryParams };
                      delete next[k];
                      next[e.target.value] = v;
                      update({ queryParams: next });
                    }}
                    placeholder="Key"
                    className="flex-1 rounded bg-slate-700 border border-slate-600 text-white px-2 py-1 text-sm"
                  />
                  <input
                    value={v}
                    onChange={(e) =>
                      update({ queryParams: { ...config.queryParams, [k]: e.target.value } })
                    }
                    placeholder="Value"
                    className="flex-1 rounded bg-slate-700 border border-slate-600 text-white px-2 py-1 text-sm"
                  />
                  <button onClick={() => removeParam(k)} className="text-red-400 text-sm">
                    ×
                  </button>
                </div>
              ))}
              <button onClick={addParam} className="text-violet-400 text-sm">
                + Add param
              </button>
            </div>
          )}
        </div>
        <div>
          <button
            onClick={() => setHeadersOpen(!headersOpen)}
            className="text-sm text-slate-400 hover:text-white w-full text-left flex items-center gap-1"
          >
            {headersOpen ? "▼" : "▶"} Headers
          </button>
          {headersOpen && (
            <div className="mt-1 space-y-1 pl-4">
              {Object.entries(config.headers).map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <input
                    value={k}
                    onChange={(e) => {
                      const next = { ...config.headers };
                      delete next[k];
                      next[e.target.value] = v;
                      update({ headers: next });
                    }}
                    placeholder="Header"
                    className="flex-1 rounded bg-slate-700 border border-slate-600 text-white px-2 py-1 text-sm"
                  />
                  <input
                    value={v}
                    onChange={(e) =>
                      update({ headers: { ...config.headers, [k]: e.target.value } })
                    }
                    placeholder="Value"
                    className="flex-1 rounded bg-slate-700 border border-slate-600 text-white px-2 py-1 text-sm"
                  />
                  <button onClick={() => removeHeader(k)} className="text-red-400 text-sm">
                    ×
                  </button>
                </div>
              ))}
              <button onClick={addHeader} className="text-violet-400 text-sm">
                + Add header
              </button>
            </div>
          )}
        </div>
        {!["GET"].includes(config.method) && (
          <div>
            <button
              onClick={() => setBodyOpen(!bodyOpen)}
              className="text-sm text-slate-400 hover:text-white w-full text-left flex items-center gap-1"
            >
              {bodyOpen ? "▼" : "▶"} Body
            </button>
            {bodyOpen && (
              <div className="mt-1 pl-4">
                <textarea
                  value={config.body}
                  onChange={(e) => update({ body: e.target.value })}
                  placeholder='{"key": "value"}'
                  className="w-full rounded bg-slate-700 border border-slate-600 text-white px-2 py-1.5 text-sm font-mono min-h-[120px]"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
