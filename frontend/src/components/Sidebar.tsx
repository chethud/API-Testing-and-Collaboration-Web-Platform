import { useState, useEffect } from "react";
import api from "../api/client";
import MockPanel from "./MockPanel";

type Workspace = { _id: string; name: string; type: string };
type Collection = { _id: string; name: string; workspaceId: string };
type ApiRequestItem = { _id: string; name: string; method: string; collectionId?: string };

type Props = {
  workspaceId: string | null;
  onWorkspaceChange: (id: string) => void;
  requestId: string | null;
  onSelectRequest: (req: ApiRequestItem | null) => void;
  workspaces: Workspace[];
};

export default function Sidebar({
  workspaceId,
  onWorkspaceChange,
  requestId,
  onSelectRequest,
  workspaces,
}: Props) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [requests, setRequests] = useState<ApiRequestItem[]>([]);
  const [addingCollection, setAddingCollection] = useState(false);
  const [newColName, setNewColName] = useState("");

  useEffect(() => {
    if (!workspaceId) {
      setCollections([]);
      setRequests([]);
      return;
    }
    api.get<Collection[]>(`/collections?workspaceId=${workspaceId}`).then(({ data }) => setCollections(data));
    api.get<ApiRequestItem[]>(`/requests?workspaceId=${workspaceId}`).then(({ data }) => setRequests(data));
  }, [workspaceId]);

  async function createCollection() {
    if (!workspaceId || !newColName.trim()) return;
    await api.post("/collections", { name: newColName.trim(), workspaceId });
    setNewColName("");
    setAddingCollection(false);
    api.get<Collection[]>(`/collections?workspaceId=${workspaceId}`).then(({ data }) => setCollections(data));
  }

  async function createRequest() {
    if (!workspaceId) return;
    const { data } = await api.post<ApiRequestItem>("/requests", {
      name: "New Request",
      method: "GET",
      url: "",
      workspaceId,
    });
    setRequests((prev) => [data, ...prev]);
    onSelectRequest(data);
  }

  const methodColor: Record<string, string> = {
    GET: "text-green-400",
    POST: "text-yellow-400",
    PUT: "text-blue-400",
    PATCH: "text-orange-400",
    DELETE: "text-red-400",
  };

  return (
    <div className="w-64 flex flex-col border-r border-slate-700 bg-slate-800 overflow-hidden">
      <div className="p-2 border-b border-slate-700">
        <select
          value={workspaceId || ""}
          onChange={(e) => onWorkspaceChange(e.target.value)}
          className="w-full rounded bg-slate-700 border border-slate-600 text-white text-sm py-1.5 px-2"
        >
          <option value="">Select workspace</option>
          {workspaces.map((w) => (
            <option key={w._id} value={w._id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
      {workspaceId && (
        <>
          <div className="p-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Collections</span>
            <button
              onClick={() => setAddingCollection(true)}
              className="text-slate-400 hover:text-white text-sm"
            >
              + New
            </button>
          </div>
          {addingCollection && (
            <div className="px-2 pb-2 flex gap-1">
              <input
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                placeholder="Collection name"
                className="flex-1 rounded bg-slate-700 border border-slate-600 text-white text-sm px-2 py-1"
                onKeyDown={(e) => e.key === "Enter" && createCollection()}
              />
              <button onClick={createCollection} className="rounded bg-violet-600 px-2 py-1 text-sm">
                Add
              </button>
            </div>
          )}
          <ul className="flex-1 overflow-auto py-1">
            {collections.map((c) => (
              <li key={c._id} className="px-2 py-1 text-sm text-slate-300">
                {c.name}
              </li>
            ))}
          </ul>
          <div className="p-2 border-t border-slate-700 flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase">Requests</span>
            <button
              onClick={createRequest}
              className="text-violet-400 hover:text-violet-300 text-sm"
            >
              + New
            </button>
          </div>
          <ul className="flex-1 overflow-auto py-1 min-h-0">
            {requests.map((r) => (
              <li
                key={r._id}
                onClick={() => onSelectRequest(r)}
                className={`px-2 py-1.5 text-sm cursor-pointer flex items-center gap-2 ${
                  requestId === r._id ? "bg-slate-700 text-white" : "hover:bg-slate-700/50"
                }`}
              >
                <span className={`font-mono text-xs ${methodColor[r.method] || "text-slate-400"}`}>
                  {r.method}
                </span>
                <span className="truncate">{r.name}</span>
              </li>
            ))}
          </ul>
          <MockPanel workspaceId={workspaceId} />
        </>
      )}
    </div>
  );
}
