import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Notifications from "./Notifications";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-200">
      <header className="flex items-center justify-between px-4 py-2 border-b border-slate-700 bg-slate-800">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold text-violet-400">API Platform</Link>
          <Link to="/analytics" className="text-sm text-slate-400 hover:text-white">Analytics</Link>
        </div>
        <div className="flex items-center gap-3">
          <Notifications />
          <span className="text-sm text-slate-400">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}
