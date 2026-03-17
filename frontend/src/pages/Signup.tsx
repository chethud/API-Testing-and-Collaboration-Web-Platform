import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { user, signup, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await signup(email, password, name);
      navigate("/");
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl bg-slate-800 p-8 shadow-xl border border-slate-700">
        <h1 className="text-2xl font-semibold text-white mb-2">Create account</h1>
        <p className="text-slate-400 text-sm mb-6">API Testing & Collaboration Platform</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-400 text-sm bg-red-400/10 rounded-lg p-2">{error}</div>
          )}
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg bg-slate-700 border border-slate-600 text-white px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-slate-700 border border-slate-600 text-white px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-slate-700 border border-slate-600 text-white px-4 py-2 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
            required
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium py-2"
          >
            Sign up
          </button>
        </form>
        <p className="text-slate-400 text-sm mt-4">
          Already have an account? <Link to="/login" className="text-violet-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
