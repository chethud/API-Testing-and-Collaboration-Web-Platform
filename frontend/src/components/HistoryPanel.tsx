import { useState, useEffect } from "react";
import api from "../api/client";

type HistoryItem = { _id: string; version: number; createdAt: string };

type Props = {
  requestId: string | null;
  onRevert: () => void;
};

export default function HistoryPanel({ requestId, onRevert }: Props) {
  const [list, setList] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!requestId) {
      setList([]);
      return;
    }
    api
      .get<HistoryItem[]>(`/requests/history/${requestId}`)
      .then(({ data }) => setList(data))
      .catch(() => setList([]));
  }, [requestId]);

  async function revert(version: number) {
    if (!requestId) return;
    await api.post(`/requests/${requestId}/revert/${version}`);
    onRevert();
  }

  if (!requestId) return null;
  return (
    <div className="border-t border-slate-700 p-2">
      <div className="text-xs font-medium text-slate-500 uppercase mb-2">History</div>
      <ul className="space-y-1 max-h-32 overflow-auto">
        {list.map((h) => (
          <li key={h._id} className="flex items-center justify-between text-sm">
            <span className="text-slate-400">v{h.version}</span>
            <button
              onClick={() => revert(h.version)}
              className="text-violet-400 hover:text-violet-300"
            >
              Restore
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
