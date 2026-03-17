import { useState, useEffect } from "react";
import api from "../api/client";

type Comment = {
  _id: string;
  text: string;
  userId: { name: string; email: string };
  createdAt: string;
};

type Props = { requestId: string | null };

export default function Comments({ requestId }: Props) {
  const [list, setList] = useState<Comment[]>([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!requestId) {
      setList([]);
      return;
    }
    api
      .get<Comment[]>(`/comments/request/${requestId}`)
      .then(({ data }) => setList(data))
      .catch(() => setList([]));
  }, [requestId, open]);

  async function submit() {
    if (!requestId || !text.trim()) return;
    await api.post(`/comments/request/${requestId}`, { text: text.trim(), mentions: [] });
    setText("");
    api.get<Comment[]>(`/comments/request/${requestId}`).then(({ data }) => setList(data));
  }

  if (!requestId) return null;

  return (
    <div className="border-t border-slate-700">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-2 text-left text-xs font-medium text-slate-500 uppercase hover:bg-slate-700/50"
      >
        {open ? "▼" : "▶"} Comments ({list.length})
      </button>
      {open && (
        <div className="p-2 space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment (@username to mention)"
            className="w-full rounded bg-slate-700 border border-slate-600 text-white text-sm px-2 py-1.5 min-h-[60px]"
          />
          <button
            onClick={submit}
            className="rounded bg-violet-600 hover:bg-violet-500 text-white px-3 py-1 text-sm"
          >
            Post
          </button>
          <ul className="space-y-2 max-h-32 overflow-auto">
            {list.map((c) => (
              <li key={c._id} className="text-sm p-2 rounded bg-slate-700/50">
                <div className="text-slate-400 text-xs">
                  {(c.userId as { name?: string })?.name || "User"} · {new Date(c.createdAt).toLocaleString()}
                </div>
                <div className="text-slate-200 mt-0.5">{c.text}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
