import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import RequestBuilder, { type RequestConfig } from "../components/RequestBuilder";
import ResponseViewer from "../components/ResponseViewer";
import HistoryPanel from "../components/HistoryPanel";
import AIPanel from "../components/AIPanel";
import Comments from "../components/Comments";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import { API_BASE } from "../api/config";

type ApiRequest = {
  _id: string;
  name: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  queryParams: Record<string, string>;
  body: string;
  bodyType: string;
  collectionId?: string;
  workspaceId: string;
};

const emptyConfig: RequestConfig = {
  method: "GET",
  url: "",
  headers: {},
  queryParams: {},
  body: "",
  bodyType: "json",
};

export default function Dashboard() {
  const { workspaces } = useAuth();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [currentRequest, setCurrentRequest] = useState<ApiRequest | null>(null);
  const [config, setConfig] = useState<RequestConfig>(emptyConfig);
  const [response, setResponse] = useState<{
    status?: number;
    statusText?: string;
    responseTime?: number;
    data?: unknown;
    error?: string;
  }>({});
  const [sending, setSending] = useState(false);
  const [requestName, setRequestName] = useState("");

  const loadRequest = useCallback(async (req: { _id: string } | null) => {
    if (!req) {
      setCurrentRequest(null);
      setConfig(emptyConfig);
      setRequestName("");
      return;
    }
    const { data } = await api.get<ApiRequest>(`/requests/${req._id}`);
    setCurrentRequest(data);
    setRequestName(data.name);
    setConfig({
      method: data.method,
      url: data.url,
      headers: data.headers || {},
      queryParams: data.queryParams || {},
      body: data.body || "",
      bodyType: data.bodyType || "json",
    });
  }, []);

  useEffect(() => {
    if (!workspaceId) return;
    const socket = io(API_BASE || window.location.origin, { path: "/socket.io", withCredentials: true });
    socket.emit("join_workspace", workspaceId);
    socket.on("request_updated", (payload: { requestId: string }) => {
      if (currentRequest?._id === payload.requestId) {
        api.get<ApiRequest>(`/requests/${payload.requestId}`).then(({ data }) => loadRequest(data));
      }
    });
    return () => {
      socket.off("request_updated");
      socket.disconnect();
    };
  }, [workspaceId, currentRequest?._id, loadRequest]);

  async function saveRequest() {
    if (!currentRequest || !workspaceId) return;
    await api.patch(`/requests/${currentRequest._id}`, {
      name: requestName,
      method: config.method,
      url: config.url,
      headers: config.headers,
      queryParams: config.queryParams,
      body: config.body,
      bodyType: config.bodyType,
    });
    setCurrentRequest((prev) =>
      prev ? { ...prev, name: requestName, method: config.method, url: config.url, headers: config.headers, queryParams: config.queryParams, body: config.body, bodyType: config.bodyType } : null
    );
  }

  useEffect(() => {
    const t = setTimeout(saveRequest, 800);
    return () => clearTimeout(t);
  }, [config, requestName]);

  async function sendRequest() {
    if (!workspaceId) return;
    setSending(true);
    setResponse({});
    try {
      const { data } = await api.post<{
        status: number;
        statusText: string;
        responseTime: number;
        data: unknown;
      }>("/execute", {
        ...config,
        workspaceId,
      });
      setResponse({
        status: data.status,
        statusText: data.statusText,
        responseTime: data.responseTime,
        data: data.data,
      });
    } catch (err: unknown) {
      const res = (err as { response?: { data?: { error?: string }; status?: number } })?.response;
      setResponse({
        error: res?.data?.error || "Request failed",
        status: res?.status,
        responseTime: 0,
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <Layout>
      <Sidebar
        workspaceId={workspaceId}
        onWorkspaceChange={(id) => {
          setWorkspaceId(id);
          setCurrentRequest(null);
          setResponse({});
        }}
        requestId={currentRequest?._id ?? null}
        onSelectRequest={loadRequest}
        workspaces={workspaces}
      />
      <div className="flex-1 flex flex-col min-w-0">
        {currentRequest && (
          <div className="px-2 py-1 border-b border-slate-700 flex items-center gap-2">
            <input
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              className="bg-transparent border-none text-white font-medium focus:ring-0 focus:outline-none flex-1"
            />
          </div>
        )}
        <div className="flex-1 grid grid-cols-2 gap-0 min-h-0">
          <div className="flex flex-col border-r border-slate-700 min-h-0">
            <RequestBuilder
              config={config}
              onChange={setConfig}
              onSend={sendRequest}
              loading={sending}
            />
            <AIPanel onApply={(c) => setConfig((prev) => ({ ...prev, ...c }))} />
            <HistoryPanel
              requestId={currentRequest?._id ?? null}
              onRevert={async () => {
                if (!currentRequest) return;
                const { data } = await api.get<ApiRequest>(`/requests/${currentRequest._id}`);
                loadRequest(data);
              }}
            />
            <Comments requestId={currentRequest?._id ?? null} />
          </div>
          <div className="flex flex-col min-h-0 bg-slate-800/50">
            <ResponseViewer
              status={response.status}
              statusText={response.statusText}
              responseTime={response.responseTime}
              data={response.data}
              error={response.error}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
