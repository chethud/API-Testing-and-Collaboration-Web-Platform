import { useState, useEffect } from "react";
import api from "../api/client";

type MockEndpoint = { _id: string; path: string; method: string; statusCode: number };

type Props = { workspaceId: string | null };

export default function MockPanel({ workspaceId }: Props) {
  const [list, setList] = useState<MockEndpoint[]>([]);
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("");
  const [method, setMethod] = useState("GET");
  const [statusCode, setStatusCode] = useState(200);
  const [responseBody, setResponseBody] = useState("{}");

  useEffect(() => {
    if (!workspaceId) {
      setList([]);
      return;
    }
    api
      .get<MockEndpoint[]>(`/mock/endpoints?workspaceId=${workspaceId}`)
      .then(({ data }) => setList(data))
      .catch(() => setList([]));
  }, [workspaceId, open]);

  async function addMock() {
    if (!workspaceId || !path.trim()) return;
    let body: unknown;
    try {
      body = JSON.parse(responseBody || "{}");
    } catch {
      body = {};
    }
    await api.post("/mock/endpoints", {
      workspaceId,
      path: path.startsWith("/") ? path : `/${path}`,
      method,
      statusCode,
      responseBody: body,
    });
    setPath("");
    setResponseBody("{}");
    api.get<MockEndpoint[]>(`/mock/endpoints?workspaceId=${workspaceId}`).then(({ data }) => setList(data));
  }

  async function remove(id: string) {
    await api.delete(`/mock/endpoints/${id}`);
    setList((prev) => prev.filter((m) => m._id !== id));
  }

  if (!workspaceId) return null;
  const baseUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/mock/server/${workspaceId}`;

  return (
    <div className="border-t border-slate-700">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-2 text-left text-xs font-medium text-slate-500 uppercase hover:bg-slate-700/50"
      >
        {open ? "▼" : "▶"} Mock server
      </button>
      {open && (
        <div className="p-2 space-y-2 text-sm">
          <div className="text-slate-400 text-xs">Base URL: {baseUrl}</div>
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="Path (e.g. /users)"
            className="w-full rounded bg-slate-700 border border-slate-600 text-white px-2 py-1"
          />
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="rounded bg-slate-700 border border-slate-600 text-white px-2 py-1"
            >
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input
              type="number"
              value={statusCode}
              onChange={(e) => setStatusCode(Number(e.target.value))}
              className="w-16 rounded bg-slate-700 border border-slate-600 text-white px-2 py-1"
            />
          </div>
          <textarea
            value={responseBody}
            onChange={(e) => setResponseBody(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full rounded bg-slate-700 border border-slate-600 text-white px-2 py-1 font-mono text-xs min-h-[60px]"
          />
          <button
            onClick={addMock}
            className="w-full rounded bg-violet-600 hover:bg-violet-500 text-white py-1 text-sm"
          >
            Add mock
          </button>
          <ul className="space-y-1 max-h-24 overflow-auto">
            {list.map((m) => (
              <li key={m._id} className="flex items-center justify-between gap-1 text-xs">
                <span className="font-mono text-slate-400 truncate">{m.method} {m.path}</span>
                <button onClick={() => remove(m._id)} className="text-red-400 shrink-0">×</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
