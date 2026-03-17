import { useState, useEffect } from "react";
import api from "../api/client";

type Notification = {
  _id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<Notification[]>([]);

  useEffect(() => {
    api.get<Notification[]>("/notifications").then(({ data }) => setList(data));
  }, [open]);

  const unread = list.filter((n) => !n.read);

  async function markRead(id: string) {
    await api.patch(`/notifications/${id}/read`);
    setList((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded hover:bg-slate-700 relative"
        title="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-violet-500 text-xs flex items-center justify-center">
            {unread.length}
          </span>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-80 max-h-96 overflow-auto rounded-lg bg-slate-800 border border-slate-700 shadow-xl z-20">
            <div className="p-2 border-b border-slate-700 font-medium">Notifications</div>
            {list.length === 0 ? (
              <div className="p-4 text-slate-500 text-sm">No notifications</div>
            ) : (
              <ul className="divide-y divide-slate-700">
                {list.map((n) => (
                  <li
                    key={n._id}
                    className={`p-3 text-sm ${!n.read ? "bg-slate-700/50" : ""}`}
                  >
                    <div className="font-medium">{n.title}</div>
                    {n.body && <div className="text-slate-400 mt-0.5">{n.body}</div>}
                    {!n.read && (
                      <button
                        onClick={() => markRead(n._id)}
                        className="text-violet-400 text-xs mt-1"
                      >
                        Mark read
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
