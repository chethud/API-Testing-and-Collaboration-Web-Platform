import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

type AnalyticsData = {
  totalCalls: number;
  success: number;
  failed: number;
  successRate: number;
  avgResponseTimeMs: number;
  recent: Array<{ method: string; url: string; status: number; responseTime: number }>;
};

export default function Analytics() {
  const { workspaces } = useAuth();
  const [workspaceId, setWorkspaceId] = useState("");
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (!workspaceId) {
      setData(null);
      return;
    }
    api
      .get<AnalyticsData>(`/analytics?workspaceId=${workspaceId}`)
      .then(({ data: d }) => setData(d))
      .catch(() => setData(null));
  }, [workspaceId]);

  return (
    <Layout>
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-xl font-semibold text-white mb-4">Analytics</h1>
        <div className="mb-4">
          <select
            value={workspaceId}
            onChange={(e) => setWorkspaceId(e.target.value)}
            className="rounded bg-slate-700 border border-slate-600 text-white px-3 py-2"
          >
            <option value="">Select workspace</option>
            {workspaces.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-4">
              <div className="text-slate-400 text-sm">Total calls (24h)</div>
              <div className="text-2xl font-semibold text-white">{data.totalCalls}</div>
            </div>
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-4">
              <div className="text-slate-400 text-sm">Success rate</div>
              <div className="text-2xl font-semibold text-green-400">{data.successRate.toFixed(1)}%</div>
            </div>
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-4">
              <div className="text-slate-400 text-sm">Avg response time</div>
              <div className="text-2xl font-semibold text-white">{data.avgResponseTimeMs} ms</div>
            </div>
            <div className="rounded-lg bg-slate-800 border border-slate-700 p-4">
              <div className="text-slate-400 text-sm">Failed</div>
              <div className="text-2xl font-semibold text-red-400">{data.failed}</div>
            </div>
          </div>
        )}
        {data && data.recent.length > 0 && (
          <div className="rounded-lg bg-slate-800 border border-slate-700 overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-700 font-medium text-white">
              Recent calls
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-left">
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2">URL</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Time (ms)</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((r, i) => (
                  <tr key={i} className="border-t border-slate-700">
                    <td className="px-4 py-2 font-mono text-green-400">{r.method}</td>
                    <td className="px-4 py-2 text-slate-300 truncate max-w-xs">{r.url}</td>
                    <td className="px-4 py-2">{r.status}</td>
                    <td className="px-4 py-2">{r.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {workspaceId && !data?.totalCalls && (
          <p className="text-slate-500">No API calls recorded yet for this workspace.</p>
        )}
      </div>
    </Layout>
  );
}
