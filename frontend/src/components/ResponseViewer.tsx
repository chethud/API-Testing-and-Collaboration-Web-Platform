type Props = {
  status?: number;
  statusText?: string;
  responseTime?: number;
  data?: unknown;
  error?: string;
};

export default function ResponseViewer({
  status,
  statusText,
  responseTime,
  data,
  error,
}: Props) {
  if (error) {
    return (
      <div className="p-4 text-red-400 bg-red-400/10 rounded-lg">
        <div className="font-medium">Error</div>
        <pre className="mt-1 text-sm whitespace-pre-wrap">{error}</pre>
      </div>
    );
  }
  if (status === undefined) {
    return (
      <div className="p-4 text-slate-500 text-sm">
        Send a request to see the response here.
      </div>
    );
  }

  const isOk = status >= 200 && status < 300;
  const statusColor = isOk ? "text-green-400" : "text-red-400";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 p-2 border-b border-slate-700 bg-slate-800 text-sm">
        <span className={statusColor}>
          {status} {statusText}
        </span>
        {responseTime != null && (
          <span className="text-slate-400">{responseTime} ms</span>
        )}
      </div>
      <div className="flex-1 overflow-auto p-4">
        <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap break-all">
          {typeof data === "string"
            ? data
            : JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
